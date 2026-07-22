package com.dripdoggy.backend.serviceImpl;

import com.dripdoggy.backend.Iservice.IDashboardService;
import com.dripdoggy.backend.ResponseDto.DashboardOverviewResponseDto;
import com.dripdoggy.backend.ResponseDto.DashboardOverviewResponseDto.*;
import com.dripdoggy.backend.entity.*;
import com.dripdoggy.backend.enums.DeliveryStatus;
import com.dripdoggy.backend.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
public class DashboardServiceImpl implements IDashboardService {

    @PersistenceContext
    private EntityManager entityManager;

    private final OrdersRepository ordersRepository;
    private final ProductRepository productRepository;
    private final ProductVariantSizeRepository productVariantSizeRepository;
    private final CategoryRepository categoryRepository;
    private final OrderReturnRepository orderReturnRepository;
    private final UserRepository userRepository;

    @Autowired
    public DashboardServiceImpl(
            OrdersRepository ordersRepository,
            ProductRepository productRepository,
            ProductVariantSizeRepository productVariantSizeRepository,
            CategoryRepository categoryRepository,
            OrderReturnRepository orderReturnRepository,
            UserRepository userRepository) {
        this.ordersRepository = ordersRepository;
        this.productRepository = productRepository;
        this.productVariantSizeRepository = productVariantSizeRepository;
        this.categoryRepository = categoryRepository;
        this.orderReturnRepository = orderReturnRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public DashboardOverviewResponseDto getDashboardOverview(
            String period,
            LocalDate startDate,
            LocalDate endDate,
            String vsPeriod) {

        // 1. Calculate Date Ranges
        LocalDate end = (endDate != null) ? endDate : LocalDate.now();
        LocalDate start;
        if (startDate != null) {
            start = startDate;
        } else if ("today".equalsIgnoreCase(period)) {
            start = end;
        } else {
            int days = "30d".equalsIgnoreCase(period) ? 30 : "90d".equalsIgnoreCase(period) ? 90 : 7;
            start = end.minusDays(days - 1);
        }

        long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(start, end) + 1;
        if (daysBetween <= 0) daysBetween = 1;

        // Comparison Range
        LocalDate compEnd;
        LocalDate compStart;
        if ("prev_day".equalsIgnoreCase(vsPeriod) || "today".equalsIgnoreCase(period)) {
            compEnd = start.minusDays(1);
            compStart = compEnd;
        } else if ("prev_month".equalsIgnoreCase(vsPeriod)) {
            compEnd = start.minusDays(1);
            compStart = compEnd.minusDays(30);
        } else { // default prev_week / prev_period
            compEnd = start.minusDays(1);
            compStart = compEnd.minusDays(daysBetween - 1);
        }

        LocalDateTime currentStartLdt = start.atStartOfDay();
        LocalDateTime currentEndLdt = end.atTime(LocalTime.MAX);
        LocalDateTime compStartLdt = compStart.atStartOfDay();
        LocalDateTime compEndLdt = compEnd.atTime(LocalTime.MAX);

        // 2. Compute 4 KPI Cards strictly from Database
        List<DashboardKpiDto> kpis = computeKpis(currentStartLdt, currentEndLdt, compStartLdt, compEndLdt, period, vsPeriod);

        // 3. Compute Revenue Chart (Hourly if today, Daily if multi-day)
        List<DashboardRevenueChartPointDto> revenueChart = computeRevenueChart(start, end, period);

        // 4. Compute Category Sales
        List<DashboardCategorySalesDto> categorySales = computeCategorySales(currentStartLdt, currentEndLdt);

        // 5. Compute Size Distribution (Stock per size)
        List<DashboardSizeDistDto> sizeDistribution = computeSizeDistribution();

        // 6. Compute Top Selling Products
        List<DashboardTopProductDto> topProducts = computeTopProducts(currentStartLdt, currentEndLdt);

        // 7. Compute Recent Orders
        List<DashboardRecentOrderDto> recentOrders = computeRecentOrders();

        // 8. Compute City Sales
        List<DashboardCitySalesDto> citySales = computeCitySales(currentStartLdt, currentEndLdt);

        // 9. Compute Order Retention Funnel (Net Deliveries, Exchanges, Returns)
        DashboardRetentionFunnelDto retentionFunnel = computeRetentionFunnel(currentStartLdt, currentEndLdt);
        List<DashboardRetentionPointDto> retentionFunnelPoints = new ArrayList<>();
        retentionFunnelPoints.add(new DashboardRetentionPointDto("NET DELIVERIES", retentionFunnel.getNetDeliveries(), "#224870"));
        retentionFunnelPoints.add(new DashboardRetentionPointDto("EXCHANGES", retentionFunnel.getExchanges(), "#c4a77d"));
        retentionFunnelPoints.add(new DashboardRetentionPointDto("RETURNS", retentionFunnel.getReturns(), "#717182"));

        return new DashboardOverviewResponseDto(
                kpis,
                revenueChart,
                categorySales,
                sizeDistribution,
                topProducts,
                recentOrders,
                citySales,
                retentionFunnel,
                retentionFunnelPoints
        );
    }

    private List<DashboardKpiDto> computeKpis(
            LocalDateTime currStart, LocalDateTime currEnd,
            LocalDateTime compStart, LocalDateTime compEnd,
            String period, String vsPeriod) {

        boolean isToday = "today".equalsIgnoreCase(period);
        String compLabel = "prev_day".equalsIgnoreCase(vsPeriod) || isToday
                ? "vs Yesterday"
                : "prev_month".equalsIgnoreCase(vsPeriod) ? "vs Last Month" : "vs Last Week";

        String revLabel = isToday ? "TODAY'S REVENUE" : "TOTAL REVENUE";
        String ordersLabel = isToday ? "TODAY'S ORDERS" : "TOTAL ORDERS";

        // Current Period Revenue
        BigDecimal currRevenue = getSumTotalAmount(currStart, currEnd);
        BigDecimal compRevenue = getSumTotalAmount(compStart, compEnd);
        String revChangeStr = calculatePercentageChange(currRevenue, compRevenue);
        String revTrend = currRevenue.compareTo(compRevenue) >= 0 ? "up" : "down";

        // Current Period Orders
        Long currOrdersCount = getOrderCount(currStart, currEnd);
        Long compOrdersCount = getOrderCount(compStart, compEnd);
        String ordersChangeStr = calculatePercentageChange(BigDecimal.valueOf(currOrdersCount), BigDecimal.valueOf(compOrdersCount));
        String ordersTrend = currOrdersCount >= compOrdersCount ? "up" : "down";

        // AOV
        BigDecimal currAov = currOrdersCount > 0 ? currRevenue.divide(BigDecimal.valueOf(currOrdersCount), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        BigDecimal compAov = compOrdersCount > 0 ? compRevenue.divide(BigDecimal.valueOf(compOrdersCount), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        String aovChangeStr = calculatePercentageChange(currAov, compAov);
        String aovTrend = currAov.compareTo(compAov) >= 0 ? "up" : "down";

        // Canceled Orders & Lost Amount
        Long cancelledCount = getOrderCountByStatus(DeliveryStatus.CANCELLED, currStart, currEnd);
        BigDecimal cancelledLostAmount = getSumCancelledAmount(currStart, currEnd);
        Long compCancelled = getOrderCountByStatus(DeliveryStatus.CANCELLED, compStart, compEnd);
        String cancelChangeStr = calculatePercentageChange(BigDecimal.valueOf(cancelledCount), BigDecimal.valueOf(compCancelled));
        String cancelTrend = cancelledCount <= compCancelled ? "up" : "down";

        List<DashboardKpiDto> kpis = new ArrayList<>();
        
        // 1. Revenue Card
        kpis.add(new DashboardKpiDto(
                revLabel,
                "₹" + formatCurrency(currRevenue),
                currRevenue,
                revChangeStr,
                revTrend,
                "Prev. ₹" + formatCurrency(compRevenue) + " (" + compLabel + ")"
        ));

        // 2. Orders Card
        kpis.add(new DashboardKpiDto(
                ordersLabel,
                formatNumber(currOrdersCount),
                BigDecimal.valueOf(currOrdersCount),
                ordersChangeStr,
                ordersTrend,
                "Prev. " + formatNumber(compOrdersCount) + " orders (" + compLabel + ")"
        ));

        // 3. AOV Card
        kpis.add(new DashboardKpiDto(
                "AVERAGE ORDER VALUE (AOV)",
                "₹" + formatCurrency(currAov),
                currAov,
                aovChangeStr,
                aovTrend,
                "Prev. ₹" + formatCurrency(compAov) + " (" + compLabel + ")"
        ));

        // 4. Canceled Orders Card
        kpis.add(new DashboardKpiDto(
                "CANCELED ORDERS",
                cancelledCount + " Orders COD Lost",
                BigDecimal.valueOf(cancelledCount),
                cancelChangeStr,
                cancelTrend,
                "Lost Amount: ₹" + formatCurrency(cancelledLostAmount)
        ));

        return kpis;
    }

    private DashboardRetentionFunnelDto computeRetentionFunnel(LocalDateTime start, LocalDateTime end) {
        try {
            // 1. Query all successfully delivered orders in the time period
            String jpqlDelivered = "SELECT o FROM Orders o WHERE o.orderTimestamp BETWEEN :start AND :end AND " +
                    "o.deliveryStatus IN (com.dripdoggy.backend.enums.DeliveryStatus.DELIVERED, " +
                    "com.dripdoggy.backend.enums.DeliveryStatus.RETURN_DELIVERED, " +
                    "com.dripdoggy.backend.enums.DeliveryStatus.EXCHANGE_DELIVERED)";

            List<Orders> deliveredOrders = entityManager.createQuery(jpqlDelivered, Orders.class)
                    .setParameter("start", start)
                    .setParameter("end", end)
                    .getResultList();

            long netDeliveriesCount = deliveredOrders.size();

            // 2. Query completed Exchange requests in the time period (EXCHANGE_COMPLETED only)
            String jpqlExchanges = "SELECT COUNT(r) FROM OrderReturn r WHERE r.requestType = com.dripdoggy.backend.enums.ReturnRequestType.EXCHANGE AND " +
                    "r.status = com.dripdoggy.backend.enums.ReturnStatus.EXCHANGE_COMPLETED AND " +
                    "r.createdAt BETWEEN :start AND :end";

            Long exchangesCount = entityManager.createQuery(jpqlExchanges, Long.class)
                    .setParameter("start", start)
                    .setParameter("end", end)
                    .getSingleResult();

            // 3. Query completed Return requests in the time period (REFUND_COMPLETED only)
            String jpqlReturns = "SELECT COUNT(r) FROM OrderReturn r WHERE r.requestType = com.dripdoggy.backend.enums.ReturnRequestType.RETURN AND " +
                    "r.status = com.dripdoggy.backend.enums.ReturnStatus.REFUND_COMPLETED AND " +
                    "r.createdAt BETWEEN :start AND :end";

            Long returnsCount = entityManager.createQuery(jpqlReturns, Long.class)
                    .setParameter("start", start)
                    .setParameter("end", end)
                    .getSingleResult();

            // 4. Exceptional Rule: If a customer returns or exchanges the ENTIRE order (all items in the order returned/exchanged and completed),
            // decrease netDeliveries count by 1. For partial returns/exchanges (1 out of 3), netDeliveries is NOT decreased.
            for (Orders o : deliveredOrders) {
                int totalItemsInOrder = (o.getOrderItems() != null) ? o.getOrderItems().size() : 1;

                String jpqlOrderReturnedItems = "SELECT COUNT(r) FROM OrderReturn r WHERE r.order.id = :orderId AND " +
                        "(r.status = com.dripdoggy.backend.enums.ReturnStatus.REFUND_COMPLETED OR " +
                        "r.status = com.dripdoggy.backend.enums.ReturnStatus.EXCHANGE_COMPLETED)";

                Long returnedItemCount = entityManager.createQuery(jpqlOrderReturnedItems, Long.class)
                        .setParameter("orderId", o.getId())
                        .getSingleResult();

                if (returnedItemCount != null && returnedItemCount >= totalItemsInOrder && totalItemsInOrder > 0) {
                    netDeliveriesCount--;
                }
            }


            if (netDeliveriesCount < 0) netDeliveriesCount = 0;

            return new DashboardRetentionFunnelDto(
                    netDeliveriesCount,
                    exchangesCount != null ? exchangesCount : 0L,
                    returnsCount != null ? returnsCount : 0L
            );
        } catch (Exception e) {
            return new DashboardRetentionFunnelDto(0L, 0L, 0L);
        }
    }

    private BigDecimal getSumTotalAmount(LocalDateTime start, LocalDateTime end) {
        try {
            String jpql = "SELECT COALESCE(SUM(o.totalAmount), 0) FROM Orders o WHERE o.orderTimestamp BETWEEN :start AND :end AND o.deliveryStatus != com.dripdoggy.backend.enums.DeliveryStatus.CANCELLED";
            return entityManager.createQuery(jpql, BigDecimal.class)
                    .setParameter("start", start)
                    .setParameter("end", end)
                    .getSingleResult();
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    private BigDecimal getSumCancelledAmount(LocalDateTime start, LocalDateTime end) {
        try {
            String jpql = "SELECT COALESCE(SUM(o.totalAmount), 0) FROM Orders o WHERE o.orderTimestamp BETWEEN :start AND :end AND o.deliveryStatus = com.dripdoggy.backend.enums.DeliveryStatus.CANCELLED";
            return entityManager.createQuery(jpql, BigDecimal.class)
                    .setParameter("start", start)
                    .setParameter("end", end)
                    .getSingleResult();
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    private Long getOrderCount(LocalDateTime start, LocalDateTime end) {
        try {
            String jpql = "SELECT COUNT(o) FROM Orders o WHERE o.orderTimestamp BETWEEN :start AND :end";
            return entityManager.createQuery(jpql, Long.class)
                    .setParameter("start", start)
                    .setParameter("end", end)
                    .getSingleResult();
        } catch (Exception e) {
            return 0L;
        }
    }

    private Long getOrderCountByStatus(DeliveryStatus status, LocalDateTime start, LocalDateTime end) {
        try {
            String jpql = "SELECT COUNT(o) FROM Orders o WHERE o.deliveryStatus = :status AND o.orderTimestamp BETWEEN :start AND :end";
            return entityManager.createQuery(jpql, Long.class)
                    .setParameter("status", status)
                    .setParameter("start", start)
                    .setParameter("end", end)
                    .getSingleResult();
        } catch (Exception e) {
            return 0L;
        }
    }

    private List<DashboardRevenueChartPointDto> computeRevenueChart(LocalDate start, LocalDate end, String period) {
        List<DashboardRevenueChartPointDto> result = new ArrayList<>();

        if ("today".equalsIgnoreCase(period) || start.equals(end)) {
            int[] hours = {0, 4, 8, 12, 16, 20};
            String[] labels = {"12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM"};

            for (int i = 0; i < hours.length; i++) {
                int hStart = hours[i];
                int hEnd = (i < hours.length - 1) ? hours[i + 1] - 1 : 23;

                LocalDateTime intervalStart = start.atTime(hStart, 0, 0);
                LocalDateTime intervalEnd = start.atTime(hEnd, 59, 59);

                BigDecimal rev = getSumTotalAmount(intervalStart, intervalEnd);
                Long orders = getOrderCount(intervalStart, intervalEnd);
                Long returns = 0L;

                result.add(new DashboardRevenueChartPointDto(
                        labels[i],
                        start.toString(),
                        rev,
                        orders,
                        returns
                ));
            }
            return result;
        }

        // Daily breakdown for multi-day periods (7d, 30d, 90d, custom)
        LocalDate curr = start;
        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("EEE");
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        while (!curr.isAfter(end)) {
            LocalDateTime dayStart = curr.atStartOfDay();
            LocalDateTime dayEnd = curr.atTime(LocalTime.MAX);

            BigDecimal dayRev = getSumTotalAmount(dayStart, dayEnd);
            Long dayOrders = getOrderCount(dayStart, dayEnd);

            String jpqlReturns = "SELECT COUNT(r) FROM OrderReturn r WHERE r.createdAt BETWEEN :start AND :end";
            Long dayReturns = 0L;
            try {
                dayReturns = entityManager.createQuery(jpqlReturns, Long.class)
                        .setParameter("start", dayStart)
                        .setParameter("end", dayEnd)
                        .getSingleResult();
            } catch (Exception ignored) {}

            result.add(new DashboardRevenueChartPointDto(
                    curr.format(dayFormatter),
                    curr.format(dateFormatter),
                    dayRev,
                    dayOrders,
                    dayReturns
            ));

            curr = curr.plusDays(1);
        }

        return result;
    }

    private List<DashboardCategorySalesDto> computeCategorySales(LocalDateTime start, LocalDateTime end) {
        try {
            String jpql = "SELECT c.categoryName, COALESCE(SUM(oi.subTotal), 0) " +
                    "FROM OrderItem oi " +
                    "JOIN oi.order o " +
                    "JOIN oi.productVariantSize pvs " +
                    "JOIN pvs.productVariant pv " +
                    "JOIN pv.product p " +
                    "JOIN p.category c " +
                    "WHERE o.orderTimestamp BETWEEN :start AND :end " +
                    "GROUP BY c.categoryName";

            List<Object[]> rows = entityManager.createQuery(jpql, Object[].class)
                    .setParameter("start", start)
                    .setParameter("end", end)
                    .getResultList();

            BigDecimal totalCategoryRev = BigDecimal.ZERO;
            for (Object[] r : rows) {
                totalCategoryRev = totalCategoryRev.add((BigDecimal) r[1]);
            }

            String[] defaultColors = {"#8c6239", "#224870", "#717182", "#c4a77d", "#d4d4d8", "#382d24"};
            List<DashboardCategorySalesDto> list = new ArrayList<>();

            int colorIdx = 0;
            for (Object[] r : rows) {
                String name = (String) r[0];
                BigDecimal rev = (BigDecimal) r[1];
                double pct = totalCategoryRev.compareTo(BigDecimal.ZERO) > 0
                        ? rev.multiply(BigDecimal.valueOf(100)).divide(totalCategoryRev, 1, RoundingMode.HALF_UP).doubleValue()
                        : 0.0;

                list.add(new DashboardCategorySalesDto(name, pct, rev, defaultColors[colorIdx % defaultColors.length]));
                colorIdx++;
            }

            return list;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private List<DashboardSizeDistDto> computeSizeDistribution() {
        try {
            String[] sizes = {"XS", "S", "M", "L", "XL", "XXL"};
            List<DashboardSizeDistDto> list = new ArrayList<>();

            for (String sz : sizes) {
                String jpqlStock = "SELECT COALESCE(SUM(pvs.stockQuantity), 0) FROM ProductVariantSize pvs WHERE UPPER(pvs.sizeName) = :sz";
                Integer stock = 0;
                try {
                    stock = entityManager.createQuery(jpqlStock, Long.class)
                            .setParameter("sz", sz.toUpperCase())
                            .getSingleResult().intValue();
                } catch (Exception ignored) {}

                list.add(new DashboardSizeDistDto(sz, stock));
            }

            return list;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private List<DashboardTopProductDto> computeTopProducts(LocalDateTime start, LocalDateTime end) {
        try {
            // 1. Query top-selling products by item quantity within the selected time period
            String jpql = "SELECT p.productName, p.skuCode, pv.price, SUM(oi.quantity) as totalQty, SUM(oi.subTotal) as totalRev, pv.primaryImageUrl " +
                    "FROM OrderItem oi " +
                    "JOIN oi.order o " +
                    "JOIN oi.productVariantSize pvs " +
                    "JOIN pvs.productVariant pv " +
                    "JOIN pv.product p " +
                    "WHERE o.orderTimestamp BETWEEN :start AND :end " +
                    "GROUP BY p.id, p.productName, p.skuCode, pv.price, pv.primaryImageUrl " +
                    "ORDER BY SUM(oi.quantity) DESC";

            List<Object[]> rows = entityManager.createQuery(jpql, Object[].class)
                    .setParameter("start", start)
                    .setParameter("end", end)
                    .setMaxResults(5)
                    .getResultList();

            // 2. Fallback: If no orders in current period, query all-time top-selling products
            if (rows.isEmpty()) {
                String jpqlAllTime = "SELECT p.productName, p.skuCode, pv.price, SUM(oi.quantity) as totalQty, SUM(oi.subTotal) as totalRev, pv.primaryImageUrl " +
                        "FROM OrderItem oi " +
                        "JOIN oi.order o " +
                        "JOIN oi.productVariantSize pvs " +
                        "JOIN pvs.productVariant pv " +
                        "JOIN pv.product p " +
                        "GROUP BY p.id, p.productName, p.skuCode, pv.price, pv.primaryImageUrl " +
                        "ORDER BY SUM(oi.quantity) DESC";

                rows = entityManager.createQuery(jpqlAllTime, Object[].class)
                        .setMaxResults(5)
                        .getResultList();
            }

            // 3. Mock Fallback: If database is completely empty of checkouts, show high-fidelity placeholders
            if (rows.isEmpty()) {
                List<DashboardTopProductDto> list = new ArrayList<>();
                list.add(new DashboardTopProductDto("Structured Canvas Jacket", "#DD-STR-001", BigDecimal.valueOf(5800), 342L, BigDecimal.valueOf(1983600), "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=120&auto=format&fit=crop", "In Stock"));
                list.add(new DashboardTopProductDto("Sartorial Trench Coat", "#DD-SAR-001", BigDecimal.valueOf(6900), 287L, BigDecimal.valueOf(1980300), "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=120&auto=format&fit=crop", "In Stock"));
                list.add(new DashboardTopProductDto("French Terry Hoodie", "#DD-FTH-001", BigDecimal.valueOf(3200), 256L, BigDecimal.valueOf(819200), "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=120&auto=format&fit=crop", "Low Stock"));
                list.add(new DashboardTopProductDto("Parachute Cargo Skirt", "#DD-PCS-001", BigDecimal.valueOf(3400), 198L, BigDecimal.valueOf(673200), "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=120&auto=format&fit=crop", "In Stock"));
                list.add(new DashboardTopProductDto("Boxy Minimalist Maxi", "#DD-BMM-001", BigDecimal.valueOf(4200), 167L, BigDecimal.valueOf(701400), "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=120&auto=format&fit=crop", "Out of Stock"));
                return list;
            }

            List<DashboardTopProductDto> list = new ArrayList<>();
            for (Object[] r : rows) {
                String name = (String) r[0];
                String sku = (String) r[1];
                BigDecimal price = (BigDecimal) r[2];
                Long totalQty = (Long) r[3];
                BigDecimal totalRev = (BigDecimal) r[4];
                String imgUrl = (String) r[5];

                if (imgUrl == null || imgUrl.trim().isEmpty()) {
                    imgUrl = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=120&auto=format&fit=crop";
                }

                list.add(new DashboardTopProductDto(
                        name,
                        sku != null ? sku : "#DD-PROD",
                        price != null ? price : BigDecimal.ZERO,
                        totalQty,
                        totalRev != null ? totalRev : BigDecimal.ZERO,
                        imgUrl,
                        "In Stock"
                ));
            }

            return list;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }


    private List<DashboardRecentOrderDto> computeRecentOrders() {
        try {
            String jpql = "SELECT o FROM Orders o ORDER BY o.orderTimestamp DESC";
            List<Orders> orders = entityManager.createQuery(jpql, Orders.class)
                    .setMaxResults(5)
                    .getResultList();

            List<DashboardRecentOrderDto> list = new ArrayList<>();
            DateTimeFormatter dtFormatter = DateTimeFormatter.ofPattern("dd MMM | h:mm a");

            for (Orders o : orders) {
                String customerName = "Guest Customer";
                if (o.getUser() != null) {
                    User u = o.getUser();
                    if (u.getFirstName() != null) {
                        customerName = u.getFirstName() + (u.getLastName() != null ? " " + u.getLastName() : "");
                    } else if (u.getEmail() != null) {
                        customerName = u.getEmail();
                    } else {
                        customerName = "User #" + u.getId();
                    }
                } else if (o.getAddress() != null && o.getAddress().getFirstName() != null) {
                    customerName = o.getAddress().getFirstName() + " " + (o.getAddress().getLastName() != null ? o.getAddress().getLastName() : "");
                }

                String productName = "Multiple Items";
                String size = "M";
                if (o.getOrderItems() != null && !o.getOrderItems().isEmpty()) {
                    OrderItem firstItem = o.getOrderItems().get(0);
                    if (firstItem.getProductVariantSize() != null) {
                        if (firstItem.getProductVariantSize().getProductVariant() != null &&
                            firstItem.getProductVariantSize().getProductVariant().getProduct() != null) {
                            productName = firstItem.getProductVariantSize().getProductVariant().getProduct().getProductName();
                        }
                        size = firstItem.getProductVariantSize().getSizeName();
                    }
                }

                String dateStr = o.getOrderTimestamp() != null ? o.getOrderTimestamp().toString() : "";
                String statusStr = o.getDeliveryStatus() != null ? o.getDeliveryStatus().name() : "PENDING";

                list.add(new DashboardRecentOrderDto(
                        "#DD-" + o.getId(),
                        customerName,
                        productName,
                        size,
                        o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO,
                        statusStr,
                        dateStr
                ));
            }

            return list;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private List<DashboardCitySalesDto> computeCitySales(LocalDateTime start, LocalDateTime end) {
        try {
            String jpql = "SELECT a.city, SUM(o.totalAmount), COUNT(o) " +
                    "FROM Orders o " +
                    "JOIN o.address a " +
                    "WHERE o.orderTimestamp BETWEEN :start AND :end AND a.city IS NOT NULL " +
                    "GROUP BY a.city " +
                    "ORDER BY SUM(o.totalAmount) DESC";

            List<Object[]> rows = entityManager.createQuery(jpql, Object[].class)
                    .setMaxResults(5)
                    .getResultList();

            BigDecimal topSales = BigDecimal.ONE;
            if (!rows.isEmpty()) {
                topSales = (BigDecimal) rows.get(0)[1];
                if (topSales == null || topSales.compareTo(BigDecimal.ZERO) == 0) topSales = BigDecimal.ONE;
            }

            List<DashboardCitySalesDto> list = new ArrayList<>();
            for (Object[] r : rows) {
                String city = (String) r[0];
                BigDecimal sales = (BigDecimal) r[1];
                Long count = (Long) r[2];

                double pctVal = sales.multiply(BigDecimal.valueOf(100)).divide(topSales, 0, RoundingMode.HALF_UP).doubleValue();

                list.add(new DashboardCitySalesDto(
                        city,
                        sales != null ? sales : BigDecimal.ZERO,
                        count,
                        "+15%",
                        (int) pctVal + "%"
                ));
            }

            return list;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private String calculatePercentageChange(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) > 0 ? "+100.0%" : "0.0%";
        }
        BigDecimal diff = current.subtract(previous);
        BigDecimal pct = diff.multiply(BigDecimal.valueOf(100)).divide(previous, 1, RoundingMode.HALF_UP);
        return (pct.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "") + pct + "%";
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null) return "0";
        return String.format("%,.2f", amount);
    }

    private String formatNumber(Long number) {
        if (number == null) return "0";
        return String.format("%,d", number);
    }
}

package com.dripdoggy.backend.ResponseDto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardOverviewResponseDto {

    private List<DashboardKpiDto> kpis;
    private List<DashboardRevenueChartPointDto> revenueChart;
    private List<DashboardCategorySalesDto> categorySales;
    private List<DashboardSizeDistDto> sizeDistribution;
    private List<DashboardTopProductDto> topProducts;
    private List<DashboardRecentOrderDto> recentOrders;
    private List<DashboardCitySalesDto> citySales;
    private DashboardRetentionFunnelDto retentionFunnel;
    private List<DashboardRetentionPointDto> retentionFunnelPoints;

    public DashboardOverviewResponseDto() {
    }

    public DashboardOverviewResponseDto(
            List<DashboardKpiDto> kpis,
            List<DashboardRevenueChartPointDto> revenueChart,
            List<DashboardCategorySalesDto> categorySales,
            List<DashboardSizeDistDto> sizeDistribution,
            List<DashboardTopProductDto> topProducts,
            List<DashboardRecentOrderDto> recentOrders,
            List<DashboardCitySalesDto> citySales,
            DashboardRetentionFunnelDto retentionFunnel,
            List<DashboardRetentionPointDto> retentionFunnelPoints) {
        this.kpis = kpis;
        this.revenueChart = revenueChart;
        this.categorySales = categorySales;
        this.sizeDistribution = sizeDistribution;
        this.topProducts = topProducts;
        this.recentOrders = recentOrders;
        this.citySales = citySales;
        this.retentionFunnel = retentionFunnel;
        this.retentionFunnelPoints = retentionFunnelPoints;
    }

    public List<DashboardKpiDto> getKpis() {
        return kpis;
    }

    public void setKpis(List<DashboardKpiDto> kpis) {
        this.kpis = kpis;
    }

    public List<DashboardRevenueChartPointDto> getRevenueChart() {
        return revenueChart;
    }

    public void setRevenueChart(List<DashboardRevenueChartPointDto> revenueChart) {
        this.revenueChart = revenueChart;
    }

    public List<DashboardCategorySalesDto> getCategorySales() {
        return categorySales;
    }

    public void setCategorySales(List<DashboardCategorySalesDto> categorySales) {
        this.categorySales = categorySales;
    }

    public List<DashboardSizeDistDto> getSizeDistribution() {
        return sizeDistribution;
    }

    public void setSizeDistribution(List<DashboardSizeDistDto> sizeDistribution) {
        this.sizeDistribution = sizeDistribution;
    }

    public List<DashboardTopProductDto> getTopProducts() {
        return topProducts;
    }

    public void setTopProducts(List<DashboardTopProductDto> topProducts) {
        this.topProducts = topProducts;
    }

    public List<DashboardRecentOrderDto> getRecentOrders() {
        return recentOrders;
    }

    public void setRecentOrders(List<DashboardRecentOrderDto> recentOrders) {
        this.recentOrders = recentOrders;
    }

    public List<DashboardCitySalesDto> getCitySales() {
        return citySales;
    }

    public void setCitySales(List<DashboardCitySalesDto> citySales) {
        this.citySales = citySales;
    }

    public DashboardRetentionFunnelDto getRetentionFunnel() {
        return retentionFunnel;
    }

    public void setRetentionFunnel(DashboardRetentionFunnelDto retentionFunnel) {
        this.retentionFunnel = retentionFunnel;
    }

    public List<DashboardRetentionPointDto> getRetentionFunnelPoints() {
        return retentionFunnelPoints;
    }

    public void setRetentionFunnelPoints(List<DashboardRetentionPointDto> retentionFunnelPoints) {
        this.retentionFunnelPoints = retentionFunnelPoints;
    }

    // --- Inner DTO Classes for clean payload serialization ---

    public static class DashboardKpiDto {
        private String label;
        private String value;
        private BigDecimal rawValue;
        private String change;
        private String trend; // "up" or "down"
        private String subtitle;

        public DashboardKpiDto() {}

        public DashboardKpiDto(String label, String value, BigDecimal rawValue, String change, String trend, String subtitle) {
            this.label = label;
            this.value = value;
            this.rawValue = rawValue;
            this.change = change;
            this.trend = trend;
            this.subtitle = subtitle;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }

        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }

        public BigDecimal getRawValue() { return rawValue; }
        public void setRawValue(BigDecimal rawValue) { this.rawValue = rawValue; }

        public String getChange() { return change; }
        public void setChange(String change) { this.change = change; }

        public String getTrend() { return trend; }
        public void setTrend(String trend) { this.trend = trend; }

        public String getSubtitle() { return subtitle; }
        public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    }

    public static class DashboardRevenueChartPointDto {
        private String day;
        private String date;
        private BigDecimal revenue;
        private Long orders;
        private Long returns;

        public DashboardRevenueChartPointDto() {}

        public DashboardRevenueChartPointDto(String day, String date, BigDecimal revenue, Long orders, Long returns) {
            this.day = day;
            this.date = date;
            this.revenue = revenue;
            this.orders = orders;
            this.returns = returns;
        }

        public String getDay() { return day; }
        public void setDay(String day) { this.day = day; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

        public Long getOrders() { return orders; }
        public void setOrders(Long orders) { this.orders = orders; }

        public Long getReturns() { return returns; }
        public void setReturns(Long returns) { this.returns = returns; }
    }

    public static class DashboardCategorySalesDto {
        private String name;
        private Double value; // Percentage
        private BigDecimal revenue;
        private String color;

        public DashboardCategorySalesDto() {}

        public DashboardCategorySalesDto(String name, Double value, BigDecimal revenue, String color) {
            this.name = name;
            this.value = value;
            this.revenue = revenue;
            this.color = color;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public Double getValue() { return value; }
        public void setValue(Double value) { this.value = value; }

        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }

    public static class DashboardSizeDistDto {
        private String size;
        private Integer stock;

        public DashboardSizeDistDto() {}

        public DashboardSizeDistDto(String size, Integer stock) {
            this.size = size;
            this.stock = stock;
        }

        public String getSize() { return size; }
        public void setSize(String size) { this.size = size; }

        public Integer getStock() { return stock; }
        public void setStock(Integer stock) { this.stock = stock; }
    }

    public static class DashboardTopProductDto {
        private String name;
        private String sku;
        private BigDecimal price;
        private Long orders;
        private BigDecimal revenue;
        private String image;
        private String status;

        public DashboardTopProductDto() {}

        public DashboardTopProductDto(String name, String sku, BigDecimal price, Long orders, BigDecimal revenue, String image, String status) {
            this.name = name;
            this.sku = sku;
            this.price = price;
            this.orders = orders;
            this.revenue = revenue;
            this.image = image;
            this.status = status;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }

        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }

        public Long getOrders() { return orders; }
        public void setOrders(Long orders) { this.orders = orders; }

        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

        public String getImage() { return image; }
        public void setImage(String image) { this.image = image; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class DashboardRecentOrderDto {
        private String id;
        private String customer;
        private String product;
        private String size;
        private BigDecimal amount;
        private String status;
        private String date;

        public DashboardRecentOrderDto() {}

        public DashboardRecentOrderDto(String id, String customer, String product, String size, BigDecimal amount, String status, String date) {
            this.id = id;
            this.customer = customer;
            this.product = product;
            this.size = size;
            this.amount = amount;
            this.status = status;
            this.date = date;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getCustomer() { return customer; }
        public void setCustomer(String customer) { this.customer = customer; }

        public String getProduct() { return product; }
        public void setProduct(String product) { this.product = product; }

        public String getSize() { return size; }
        public void setSize(String size) { this.size = size; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
    }

    public static class DashboardCitySalesDto {
        private String city;
        private BigDecimal sales;
        private Long orders;
        private String growth;
        private String pct;

        public DashboardCitySalesDto() {}

        public DashboardCitySalesDto(String city, BigDecimal sales, Long orders, String growth, String pct) {
            this.city = city;
            this.sales = sales;
            this.orders = orders;
            this.growth = growth;
            this.pct = pct;
        }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public BigDecimal getSales() { return sales; }
        public void setSales(BigDecimal sales) { this.sales = sales; }

        public Long getOrders() { return orders; }
        public void setOrders(Long orders) { this.orders = orders; }

        public String getGrowth() { return growth; }
        public void setGrowth(String growth) { this.growth = growth; }

        public String getPct() { return pct; }
        public void setPct(String pct) { this.pct = pct; }
    }

    public static class DashboardRetentionFunnelDto {
        private Long netDeliveries;
        private Long exchanges;
        private Long returns;

        public DashboardRetentionFunnelDto() {}

        public DashboardRetentionFunnelDto(Long netDeliveries, Long exchanges, Long returns) {
            this.netDeliveries = netDeliveries;
            this.exchanges = exchanges;
            this.returns = returns;
        }

        public Long getNetDeliveries() { return netDeliveries; }
        public void setNetDeliveries(Long netDeliveries) { this.netDeliveries = netDeliveries; }

        public Long getExchanges() { return exchanges; }
        public void setExchanges(Long exchanges) { this.exchanges = exchanges; }

        public Long getReturns() { return returns; }
        public void setReturns(Long returns) { this.returns = returns; }
    }

    public static class DashboardRetentionPointDto {
        private String name;
        private Long value;
        private String color;

        public DashboardRetentionPointDto() {}

        public DashboardRetentionPointDto(String name, Long value, String color) {
            this.name = name;
            this.value = value;
            this.color = color;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public Long getValue() { return value; }
        public void setValue(Long value) { this.value = value; }

        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }
}

package com.dripdoggy.backend.controller;

import com.dripdoggy.backend.Iservice.IDashboardService;
import com.dripdoggy.backend.ResponseDto.DashboardOverviewResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final IDashboardService dashboardService;

    @Autowired
    public AdminDashboardController(IDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/overview")
    public ResponseEntity<DashboardOverviewResponseDto> getDashboardOverview(
            @RequestParam(defaultValue = "7d") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "prev_week") String vsPeriod) {

        DashboardOverviewResponseDto overview = dashboardService.getDashboardOverview(
                period, startDate, endDate, vsPeriod
        );
        return ResponseEntity.ok(overview);
    }
}

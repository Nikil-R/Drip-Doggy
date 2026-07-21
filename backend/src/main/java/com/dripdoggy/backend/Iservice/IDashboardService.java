package com.dripdoggy.backend.Iservice;

import com.dripdoggy.backend.ResponseDto.DashboardOverviewResponseDto;

import java.time.LocalDate;

public interface IDashboardService {

    DashboardOverviewResponseDto getDashboardOverview(
            String period,
            LocalDate startDate,
            LocalDate endDate,
            String vsPeriod
    );
}

package com.dripdoggy.backend.ResponseDto;

public class CustomerStatsResponseDto {
    private int status;
    private String message;
    private Data data;

    public CustomerStatsResponseDto() {
    }

    public CustomerStatsResponseDto(int status, String message, Data data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Data getData() {
        return data;
    }

    public void setData(Data data) {
        this.data = data;
    }

    public static class Data {
        private long totalCustomers;
        private long activeThisMonth;
        private long newThisWeek;
        private long inactiveCustomers;

        public Data() {
        }

        public Data(long totalCustomers, long activeThisMonth, long newThisWeek, long inactiveCustomers) {
            this.totalCustomers = totalCustomers;
            this.activeThisMonth = activeThisMonth;
            this.newThisWeek = newThisWeek;
            this.inactiveCustomers = inactiveCustomers;
        }

        // Getters and Setters
        public long getTotalCustomers() {
            return totalCustomers;
        }

        public void setTotalCustomers(long totalCustomers) {
            this.totalCustomers = totalCustomers;
        }

        public long getActiveThisMonth() {
            return activeThisMonth;
        }

        public void setActiveThisMonth(long activeThisMonth) {
            this.activeThisMonth = activeThisMonth;
        }

        public long getNewThisWeek() {
            return newThisWeek;
        }

        public void setNewThisWeek(long newThisWeek) {
            this.newThisWeek = newThisWeek;
        }

        public long getInactiveCustomers() {
            return inactiveCustomers;
        }

        public void setInactiveCustomers(long inactiveCustomers) {
            this.inactiveCustomers = inactiveCustomers;
        }
    }
}

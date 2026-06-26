package com.dripdoggy.backend.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseFixer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN email VARCHAR(255) NULL");
            jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN phone_no VARCHAR(255) NULL");
            System.out.println("Successfully altered users table to make email and phone_no nullable.");
        } catch (Exception e) {
            System.out.println("Could not alter users table (might have been altered already): " + e.getMessage());
        }
    }
}

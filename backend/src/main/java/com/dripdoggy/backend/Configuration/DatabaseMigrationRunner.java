package com.dripdoggy.backend.Configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseMigrationRunner implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseMigrationRunner.class);

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public DatabaseMigrationRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        try {
            jdbcTemplate.execute("ALTER TABLE products MODIFY COLUMN product_description LONGTEXT");
            logger.info("Successfully altered products.product_description column to LONGTEXT");
        } catch (Exception e) {
            logger.warn("Could not alter product_description column (it may already be LONGTEXT or table not created yet): {}", e.getMessage());
        }
    }
}

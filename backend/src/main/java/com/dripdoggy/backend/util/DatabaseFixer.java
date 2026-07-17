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
        } catch (Exception e) {
            // Already modified, ignore message
        }

        if (!columnExists("cart", "bundle_id")) {
            try {
                jdbcTemplate.execute("ALTER TABLE cart ADD COLUMN bundle_id BIGINT NULL");
                jdbcTemplate.execute("ALTER TABLE cart ADD CONSTRAINT fk_cart_bundle FOREIGN KEY (bundle_id) REFERENCES bundles(id)");
                System.out.println("Successfully added bundle_id to cart table.");
            } catch (Exception e) {
                System.out.println("Could not add bundle_id to cart table: " + e.getMessage());
            }
        }

        if (!columnExists("order_items", "bundle_id")) {
            try {
                jdbcTemplate.execute("ALTER TABLE order_items ADD COLUMN bundle_id BIGINT NULL");
                jdbcTemplate.execute("ALTER TABLE order_items ADD CONSTRAINT fk_order_items_bundle FOREIGN KEY (bundle_id) REFERENCES bundles(id)");
                System.out.println("Successfully added bundle_id to order_items table.");
            } catch (Exception e) {
                System.out.println("Could not add bundle_id to order_items table: " + e.getMessage());
            }
        }

        try {
            // Alter bundles table to transition from main_product_id to main_product_variant_id
            if (!columnExists("bundles", "main_product_variant_id")) {
                try {
                    jdbcTemplate.execute("ALTER TABLE bundles DROP FOREIGN KEY FKm9y2bcf77hcg2u117qy2hk34");
                } catch (Exception e) { /* Ignored */ }
                try {
                    jdbcTemplate.execute("ALTER TABLE bundles DROP COLUMN main_product_id");
                } catch (Exception e) { /* Ignored */ }
                try {
                    jdbcTemplate.execute("ALTER TABLE bundles ADD COLUMN main_product_variant_id BIGINT NULL");
                } catch (Exception e) { /* Ignored */ }
                try {
                    jdbcTemplate.execute("ALTER TABLE bundles ADD CONSTRAINT fk_bundles_main_variant FOREIGN KEY (main_product_variant_id) REFERENCES product_variants(id)");
                } catch (Exception e) { /* Ignored */ }
            }

            if (!columnExists("bundles", "is_deleted")) {
                try {
                    jdbcTemplate.execute("ALTER TABLE bundles ADD COLUMN is_deleted BIT(1) DEFAULT 0");
                } catch (Exception e) { /* Ignored */ }
            }

            // Alter bundle_items table to transition from product_id to product_variant_id
            if (!columnExists("bundle_items", "product_variant_id")) {
                try {
                    jdbcTemplate.execute("ALTER TABLE bundle_items DROP FOREIGN KEY FKnsknapfft2bfgq2ktievb8vv1");
                } catch (Exception e) { /* Ignored */ }
                try {
                    jdbcTemplate.execute("ALTER TABLE bundle_items DROP COLUMN product_id");
                } catch (Exception e) { /* Ignored */ }
                try {
                    jdbcTemplate.execute("ALTER TABLE bundle_items ADD COLUMN product_variant_id BIGINT NULL");
                } catch (Exception e) { /* Ignored */ }
                try {
                    jdbcTemplate.execute("ALTER TABLE bundle_items ADD CONSTRAINT fk_bundle_items_variant FOREIGN KEY (product_variant_id) REFERENCES product_variants(id)");
                } catch (Exception e) { /* Ignored */ }
            }
        } catch (Exception e) {
            // Ignored if migrations are already complete
        }
    }

    private boolean columnExists(String tableName, String columnName) {
        try {
            String sql = "SELECT COUNT(*) FROM information_schema.columns " +
                         "WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, tableName, columnName);
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }
}

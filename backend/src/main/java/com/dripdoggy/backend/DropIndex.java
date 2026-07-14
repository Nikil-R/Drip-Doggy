package com.dripdoggy.backend;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DropIndex {
    public static void main(String[] args) {
        String url = "jdbc:mysql://3.109.130.101:3306/DripDoggy";
        String user = "dripdoggy";
        String password = "DripDoggy@143*";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {

            // Drop unique index on products
            try {
                ResultSet rs = stmt.executeQuery("SHOW INDEXES FROM products WHERE Column_name = 'sku_code' AND Non_unique = 0");
                while (rs.next()) {
                    String indexName = rs.getString("Key_name");
                    stmt.executeUpdate("ALTER TABLE products DROP INDEX " + indexName);
                    System.out.println("Dropped index " + indexName + " from products");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            // Drop unique index on product_variants
            try (Statement stmt2 = conn.createStatement()) {
                ResultSet rs = stmt2.executeQuery("SHOW INDEXES FROM product_variants WHERE Column_name = 'sku_code' AND Non_unique = 0");
                while (rs.next()) {
                    String indexName = rs.getString("Key_name");
                    stmt.executeUpdate("ALTER TABLE product_variants DROP INDEX " + indexName);
                    System.out.println("Dropped index " + indexName + " from product_variants");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            System.out.println("Finished dropping unique constraints.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

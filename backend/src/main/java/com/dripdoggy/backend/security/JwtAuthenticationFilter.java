package com.dripdoggy.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.core.userdetails.UserDetails;
import com.dripdoggy.backend.repository.UserRepository;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private UserRepository userRepository;

    private final Map<String, Boolean> blockCache = new ConcurrentHashMap<>();
    private final Map<String, Long> cacheExpiry = new ConcurrentHashMap<>();
    private static final long CACHE_TTL_MS = 30000; // 30 seconds

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String identifier = jwtUtil.extractIdentifier(token);
                if (identifier != null) {
                    long now = System.currentTimeMillis();
                    Boolean isBlocked = blockCache.get(identifier);
                    Long expiry = cacheExpiry.get(identifier);

                    if (isBlocked == null || expiry == null || now > expiry) {
                        com.dripdoggy.backend.entity.User user = userRepository.findByEmail(identifier)
                                .or(() -> userRepository.findByPhoneNo(identifier))
                                .orElse(null);
                        isBlocked = (user != null && Boolean.TRUE.equals(user.getIsBlocked()));
                        
                        blockCache.put(identifier, isBlocked);
                        cacheExpiry.put(identifier, now + CACHE_TTL_MS);
                    }

                    if (isBlocked) {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"status\": 403, \"message\": \"Your account has been blocked by the administrator.\"}");
                        return;
                    }

                    if (SecurityContextHolder.getContext().getAuthentication() == null) {
                        if (jwtUtil.validateToken(token, identifier)) {
                            UserDetails userDetails = customUserDetailsService.loadUserByUsername(identifier);
                            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        }
                    }
                }
            } catch (Exception e) {
                // Token verification failed, continue filter chain without setting auth context
            }
        }
        
        filterChain.doFilter(request, response);
    }
}

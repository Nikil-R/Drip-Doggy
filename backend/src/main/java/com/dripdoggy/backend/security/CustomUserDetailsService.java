package com.dripdoggy.backend.security;

import com.dripdoggy.backend.entity.User;
import com.dripdoggy.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .or(() -> userRepository.findByPhoneNo(username))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email or phone: " + username));

        String roleName = user.getRole() != null ? user.getRole().name() : "CUSTOMER";

        return new org.springframework.security.core.userdetails.User(
                username,
                "", // Password is not used for OTP/JWT authentication
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + roleName))
        );
    }
}

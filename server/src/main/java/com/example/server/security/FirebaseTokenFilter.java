package com.example.server.security;

import java.io.IOException;
import java.util.Collections;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.server.entity.User;
import com.example.server.service.UserService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


public class FirebaseTokenFilter extends OncePerRequestFilter {

    @Autowired
    private UserService userService;

    // private final Logger LOG = Logger.getLogger(FirebaseTokenFilter.class.getName());

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String idToken = authorizationHeader.substring(7);
            try {
                FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
                String uid = decodedToken.getUid();

                User user = userService.getUserByUid(uid);
                if (user == null) {
                    // User not found, throw an exception or send an error response.
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found. Please sign up.");
                    return;
                }

                // If user is found, set the authentication in the security context.

                // Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                // if (authentication != null) {
                //     LOG.info("User "+authentication.getName()+" is already authenticated and has the authorities "+authentication.getAuthorities().toString());
                // }

                Authentication authentication = new UsernamePasswordAuthenticationToken(
                    user, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (FirebaseAuthException e) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Firebase authentication failed.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
    
  
}

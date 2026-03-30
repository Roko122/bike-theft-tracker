package com.rkrs.bikethefttracker.config;

import com.rkrs.bikethefttracker.entity.RoleType;
import com.rkrs.bikethefttracker.filter.JwtFilter;
import com.rkrs.bikethefttracker.filter.RequestLoggingFilter;
import com.rkrs.bikethefttracker.properties.CorsProperties;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableConfigurationProperties(CorsProperties.class)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtFilter jwtFilter, RequestLoggingFilter requestLoggingFilter) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csfr -> csfr.disable())
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/auth/me").authenticated()
                        .requestMatchers(HttpMethod.GET, "/images/bikes/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/images/sightings/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/theft-reports/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/theft-reports").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/theft-reports/{theftReportId}/sightings").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/theft-reports/{theftReportId}/sightings").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/notifications/**").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/notifications/{notificationId}/read").authenticated()
                        .requestMatchers(HttpMethod.GET,"/swagger-ui.html").permitAll()
                        .requestMatchers(HttpMethod.GET,"/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/swagger-ui/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/openapi.yaml").permitAll()
                        .anyRequest().hasAuthority(RoleType.ROLE_ADMIN.name()))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((_, res, _)
                                -> res.setStatus(HttpServletResponse.SC_UNAUTHORIZED))
                        .accessDeniedHandler((_, res, _)
                                -> res.setStatus(HttpServletResponse.SC_FORBIDDEN))
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(requestLoggingFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(CorsProperties corsProperties) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(corsProperties.allowedOrigins());
        config.setAllowCredentials(corsProperties.allowCredentials());
        config.setAllowedMethods(corsProperties.allowedMethods());
        config.setAllowedHeaders(corsProperties.allowedHeaders());

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) {
        return authConfig.getAuthenticationManager();
    }
}

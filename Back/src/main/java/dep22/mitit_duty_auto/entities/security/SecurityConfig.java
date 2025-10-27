package dep22.mitit_duty_auto.entities.security;

import dep22.mitit_duty_auto.service.JwtService; // Імпортуємо JwtService
import dep22.mitit_duty_auto.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity(debug = true) // debug = true можна буде потім прибрати
@RequiredArgsConstructor
public class SecurityConfig {
    private final UserDetailsServiceImpl userDetailsService;
    // ВИДАЛЕНО: private final JwtRequestFilter jwtRequestFilter;
    private final JwtAuthenticationFilter jwtAuthFilter; // Цей фільтр використовує JwtService

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception { // Забрав AuthenticationManager звідси, він вже є біном
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/api/reports/test").permitAll()
                        // Дозволимо ці ендпоінти для всіх, поки розбираємося з JWT, потім можна буде обмежити
                        .requestMatchers("/api/documents/**").permitAll()
                        .requestMatchers("/api/reports/**").permitAll()
                        .requestMatchers("/api/instructions/**").permitAll()
                        .requestMatchers("/api/events/**").permitAll()
                        .requestMatchers("/api/signals/**").permitAll()
                        .requestMatchers("/api/upload").permitAll() // Якщо це окремий ендпоінт
                        .anyRequest().authenticated()
                )
                // .authenticationManager(authenticationManager) // authenticationManager вже налаштовується через DaoAuthenticationProvider
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .rememberMe(rememberMe -> rememberMe.disable())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // ВИКОРИСТОВУЄМО jwtAuthFilter

        return http.build();
    }


    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOriginPattern("*"); // Для розробки, потім можна зробити більш строгим
        // configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Краще так для продакшену
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")); // Переконайтесь, що PATCH є
        configuration.setAllowedHeaders(List.of("*")); // Дозволяє всі заголовки
        configuration.setAllowCredentials(true); // Важливо для cookies/auth headers

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
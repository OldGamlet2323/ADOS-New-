package dep22.mitit_duty_auto.controllers;

import dep22.mitit_duty_auto.dto.UserInfoDto;
import dep22.mitit_duty_auto.dto.UserRegistrationDto;
import dep22.mitit_duty_auto.entities.security.JwtUtil;
import dep22.mitit_duty_auto.entities.security.User;
import dep22.mitit_duty_auto.service.JwtService;
import dep22.mitit_duty_auto.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final JwtService jwtService;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegistrationDto registrationDto) {
        return ResponseEntity.ok(userService.register(registrationDto));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication!= null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            User user = userService.findByName(username).orElseThrow();
            return ResponseEntity.ok(new UserInfoDto(user));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        request.getSession(false).invalidate();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.login(), loginRequest.password())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.login());

            User user = userService.findByName(loginRequest.login()).orElseThrow();

            Map<String, Object> claims = new HashMap<>();
            claims.put("role", "ROLE_" + user.getRole().name());

            String token = jwtUtil.generateToken(claims, userDetails.getUsername());

            return ResponseEntity.ok(new AuthenticationResponse(token, user.getRole().name()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    record LoginRequest(String login, String password) {
    }

    record AuthenticationResponse(String token, String role) {
    }


}
package dep22.mitit_duty_auto.controllers;

import dep22.mitit_duty_auto.models.signals.Signal;
import dep22.mitit_duty_auto.service.SignalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Collection;

@RestController
//@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3000/admin"})
@RequestMapping("/api/signals")
public class SignalController {

    private final SignalService signalService;

    @Autowired
    public SignalController(SignalService signalService) {
        this.signalService = signalService;
    }

    @GetMapping
    public List<Signal> getAllSignals() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && isAuthenticated(authentication)) {
            return signalService.getAllSignals();
        } else {
            return Collections.emptyList();
        }
    }

    @GetMapping("/{id}")
    public Signal getSignal(@PathVariable int id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && isAuthenticated(authentication)) {
            return signalService.getSignalById(id);
        } else {
            return null;
        }
    }

    @DeleteMapping("/{id}")
    public void deleteSignal(@PathVariable int id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && isAuthenticated(authentication)) {
            signalService.deleteSignal(id);
        } else {
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }
    }

    @PostMapping
    public Signal createSignal(@RequestBody Signal signal) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && isAuthenticated(authentication)) {
            System.out.println("Received signal: " + signal); // Log the signal
            return signalService.saveSignal(signal);
        } else {
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }
    }

    private boolean isAuthenticated(Authentication authentication) {
        return authentication != null && authentication.isAuthenticated();
    }
}
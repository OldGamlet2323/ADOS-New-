package dep22.mitit_duty_auto.controllers;

import dep22.mitit_duty_auto.models.report.ListReport;
import dep22.mitit_duty_auto.service.ReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.servlet.http.HttpServletRequest; // Импортируем HttpServletRequest
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Collection;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping


    public List<ListReport> getAllReports(HttpServletRequest request) {
        String jsessionid = request.getSession().getId();
        System.out.println("JSESSIONID in /api/reports: " + jsessionid);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        System.out.println("Authentication in /api/reports: " + authentication);

        if (authentication != null && isAuthenticated(authentication)) {
            String username = authentication.getName();
            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

            System.out.println("User " + username + " is accessing reports.");
            System.out.println("User authorities: " + authorities);

            return reportService.getAllReports();
        } else {
            System.out.println("No authentication found or insufficient rights.");
            return Collections.emptyList();
        }
    }

    @GetMapping("/{id}")
    public ListReport getReportById(@PathVariable int id, HttpServletRequest request) {
        String jsessionid = request.getSession().getId();
        System.out.println("JSESSIONID in /api/reports/{id}: " + jsessionid);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authentication in /api/reports/{id}: " + authentication);

        if (authentication != null && isAuthenticated(authentication)) {
            return reportService.getReportById(id);
        } else {
            return null;
        }
    }

    @PostMapping
    public ListReport addReport(@RequestBody ListReport report, HttpServletRequest request) {
        String jsessionid = request.getSession().getId();
        System.out.println("JSESSIONID in /api/reports (POST): " + jsessionid);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authentication in /api/reports (POST): " + authentication);

        if (authentication != null && isAuthenticated(authentication)) {
            return reportService.saveReport(report);
        } else {
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }
    }

    @DeleteMapping("/{id}")
    public void deleteReportById(@PathVariable int id, HttpServletRequest request) {
        String jsessionid = request.getSession().getId();
        System.out.println("JSESSIONID in /api/reports/{id} (DELETE): " + jsessionid);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authentication in /api/reports/{id} (DELETE): " + authentication);

        if (authentication != null && isAuthenticated(authentication)) {
            reportService.deleteReportById(id);
        } else {
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }
    }
    @PutMapping("/{id}/done")
    public ResponseEntity<ListReport> markReportAsDone(@PathVariable Long id, HttpServletRequest request) {
        String jsessionid = request.getSession().getId();
        System.out.println("JSESSIONID in /api/reports/{id}/done: " + jsessionid);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authentication in /api/reports/{id}/done: " + authentication);

        if (authentication != null && isAuthenticated(authentication)) {
            ListReport report = reportService.getReportById(id.intValue());
            if (report == null) {
                return ResponseEntity.notFound().build();
            }
            report.setDone(true);
            ListReport updatedReport = reportService.saveReport(report);
            return ResponseEntity.ok(updatedReport);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

//    private boolean isAuthenticated(Authentication authentication) {
//        return authentication.isAuthenticated() && authentication.getAuthorities().stream()
//                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("DUTY_OFFICER_OF_MILITARY_UNIT"));
//    }
private boolean isAuthenticated(Authentication authentication) {
    return authentication != null && authentication.isAuthenticated();
}

    @GetMapping("/test")
    public String testEndpoint() {
        System.out.println("Test endpoint called!");
        return "Test";
    }
}
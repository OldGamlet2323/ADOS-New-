package dep22.mitit_duty_auto.controllers;

import dep22.mitit_duty_auto.models.instruction.Instruction;
import dep22.mitit_duty_auto.service.InstructionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Collection;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/instructions")
public class InstructionController {

    private final InstructionService instructionService;

    @Autowired
    public InstructionController(InstructionService instructionService) {
        this.instructionService = instructionService;
    }

    @GetMapping
    public List<Instruction> getAllInstructions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && isAuthenticated(authentication)) { // Check if authenticated and has role
            String username = authentication.getName();
            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

            System.out.println("User " + username + " is accessing instructions.");
            System.out.println("User authorities: " + authorities);

            return instructionService.getAllInstructions();
        } else {
            System.out.println("No authentication found or insufficient rights.");
            return Collections.emptyList(); // Or return a 401 Unauthorized
        }
    }

    @GetMapping("/{id}")
    public Instruction getInstructionById(@PathVariable int id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && isAuthenticated(authentication)) {
            return instructionService.getInstructionById(id);
        } else {
            return null; // or throw exception or return appropriate response
        }
    }

    @DeleteMapping("/{id}")
    public void deleteInstruction(@PathVariable int id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && isAuthenticated(authentication)) {
            instructionService.deleteInstruction(id);
        } else {
            // Handle unauthorized access, e.g., throw an exception or return a 403 Forbidden
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }
    }

    @PostMapping
    public Instruction addInstruction(@RequestBody Instruction instruction) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && isAuthenticated(authentication)) {
            return instructionService.saveInstruction(instruction);
        } else {
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }
    }

//    private boolean isAuthenticated(Authentication authentication) {
//        return authentication.isAuthenticated() && authentication.getAuthorities().stream()
//                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("DUTY_OFFICER_OF_MILITARY_UNIT"));
//    }

    private boolean isAuthenticated(Authentication authentication) {
        return authentication != null && authentication.isAuthenticated();
    }
}
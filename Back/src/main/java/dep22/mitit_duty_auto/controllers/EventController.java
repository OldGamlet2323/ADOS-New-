package dep22.mitit_duty_auto.controllers;

import dep22.mitit_duty_auto.models.schedule.notes.Event;
import dep22.mitit_duty_auto.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Collection;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public List<Event> getAllEvents() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && isAuthenticated(authentication)) {
            return eventService.getAllEvents();
        } else {
            return Collections.emptyList();
        }
    }

    @GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && isAuthenticated(authentication)) {
            return eventService.getEventById(id);
        } else {
            return null;
        }
    }

    @GetMapping("/{id}/time")
    public String getEventTime(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && isAuthenticated(authentication)) {
            Event event = eventService.getEventById(id);
            if (event != null) { // Check if event exists
                LocalTime time = LocalTime.parse(event.getEventTime());
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");
                return time.format(formatter);
            } else {
                return null; // Or appropriate response if event not found
            }
        } else {
            return null; // Or appropriate response
        }
    }

    @PostMapping
    public Event addEvent(@RequestBody Event event) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && isAuthenticated(authentication)) {
            return eventService.saveEvent(event);
        } else {
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }
    }

    @DeleteMapping("/{id}")
    public void deleteEventById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && isAuthenticated(authentication)) {
            eventService.deleteEvent(id);
        } else {
            throw new org.springframework.security.access.AccessDeniedException("Access denied");
        }
    }

    private boolean isAuthenticated(Authentication authentication) {
        return authentication != null && authentication.isAuthenticated();
    }
}
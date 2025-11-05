package dep22.mitit_duty_auto.controllers;

import dep22.mitit_duty_auto.dto.PersonnelDataRequest;
import dep22.mitit_duty_auto.service.PersonnelService;
import dep22.mitit_duty_auto.service.PersonnelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/personnel")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"},
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class PersonnelController {

    private final PersonnelService personnelService;

    /**
     * Зберегти дані розрахунку
     * POST /api/personnel/save
     */
    @PostMapping("/save")
    public ResponseEntity<?> savePersonnelData(@RequestBody PersonnelDataRequest request) {
        try {
            personnelService.savePersonnelData(request);
            // ✅ Явно повертаємо JSON-об'єкт
            return ResponseEntity.ok()
                    .body(Map.of("message", "✅ Дані успішно збережено в базі даних!"));
        } catch (Exception e){
            return ResponseEntity.status(500)
                    .body(Map.of("error", "❌ Помилка збереження: " + e.getMessage()));
        }
    }

    /**
     * Отримати дані для конкретної дати
     * GET /api/personnel/get?date=2025-01-15
     */
    @GetMapping("/get")
    public ResponseEntity<?> getPersonnelData(@RequestParam String date) {
        try {
            LocalDate targetDate = LocalDate.parse(date);
            var data = personnelService.getPersonnelData(targetDate);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "❌ Помилка завантаження: " + e.getMessage()));
        }
    }

    /**
     * Отримати останні збережені дані (сьогоднішні або останні доступні)
     * GET /api/personnel/latest
     */
    @GetMapping("/latest")
    public ResponseEntity<?> getLatestPersonnelData() {
        try {
            var data = personnelService.getLatestPersonnelData();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "❌ Помилка завантаження: " + e.getMessage()));
        }
    }
}

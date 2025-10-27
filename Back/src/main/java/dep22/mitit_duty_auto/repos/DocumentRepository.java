package dep22.mitit_duty_auto.repos;

import dep22.mitit_duty_auto.entities.Document;
import dep22.mitit_duty_auto.entities.security.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
// Можливо, знадобиться імпорт List, якщо його немає
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Integer> {
    // Спрощений метод для пошуку за Enum Roles
    List<Document> findBySendTo(Roles sendTo);
}
package dep22.mitit_duty_auto.repos;
import dep22.mitit_duty_auto.models.schedule.notes.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    void deleteById(Long id);

}
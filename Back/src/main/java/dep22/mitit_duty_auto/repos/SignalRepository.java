package dep22.mitit_duty_auto.repos;

import dep22.mitit_duty_auto.models.signals.Signal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SignalRepository extends JpaRepository<Signal, Integer> {
}

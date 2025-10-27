package dep22.mitit_duty_auto.repos;

import dep22.mitit_duty_auto.entities.security.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByName(String name);
}
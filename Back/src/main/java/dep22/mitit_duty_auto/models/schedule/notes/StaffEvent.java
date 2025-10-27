package dep22.mitit_duty_auto.models.schedule.notes;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "staff_events")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class StaffEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String staffEventName;

    private String eventTime;

    private String notes;
}


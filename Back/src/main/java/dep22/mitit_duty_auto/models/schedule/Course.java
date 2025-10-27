package dep22.mitit_duty_auto.models.schedule;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "courses")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String courseName;

    private String eventTimeAtEducationalDays;

    private String eventTimeAtWeekendsAndHolidays;

    @ManyToOne
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;
}

package dep22.mitit_duty_auto.models.schedule.notes;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Table(name = "working_days")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class WorkingDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalTime workTime;

    private LocalTime lunchBreak;
}


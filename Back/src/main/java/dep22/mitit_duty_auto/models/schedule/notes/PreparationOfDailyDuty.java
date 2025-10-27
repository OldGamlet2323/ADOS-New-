package dep22.mitit_duty_auto.models.schedule.notes;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "preparation_of_daily_dutys")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PreparationOfDailyDuty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderName;

    private String eventTime;
}


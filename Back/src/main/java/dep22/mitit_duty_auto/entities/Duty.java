package dep22.mitit_duty_auto.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity // <- Добавляем аннотацию @Entity
@Table(name = "duties") // <- Указываем имя таблицы (опционально)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Duty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private Date dutyDate;

    @Column(columnDefinition = "TEXT")
    private String transferredDuties;

    @Column(columnDefinition = "TEXT")
    private String assumedDuties;


    //  @OneToOne(mappedBy = "duty")
    //  private User user;

}
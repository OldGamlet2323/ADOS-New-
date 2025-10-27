package dep22.mitit_duty_auto.models.instruction;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "instructions")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Instruction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    @Column(length = 10000)
    private String description;

}

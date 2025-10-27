package dep22.mitit_duty_auto.models.signals;

import jakarta.persistence.*;

@Entity
@Table(name = "signals")
public class Signal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // This will auto-generate the ID
    private int id;

    private String name;
    private String description;

    // Constructors
    public Signal() {}

    public Signal(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id; // Optionally include if you want to set id manually (not recommended for new entries)
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

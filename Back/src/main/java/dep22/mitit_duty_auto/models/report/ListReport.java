    package dep22.mitit_duty_auto.models.report;

    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    @Entity
    @Table(name = "list_reports")
    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public class ListReport {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String reportName;

        private String toWhom;

        private String description;
        private boolean isDone; // Додане поле

    }

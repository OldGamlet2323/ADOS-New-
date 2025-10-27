package dep22.mitit_duty_auto.entities;

import dep22.mitit_duty_auto.entities.enums.TypeOfDocument;
import dep22.mitit_duty_auto.entities.security.Roles;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date; // Імпорт java.util.Date

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title", nullable = false)
    private String title;

    @Enumerated(EnumType.STRING) // ВАЖЛИВО!
    @Column(name = "type_of_document", nullable = false)
    private TypeOfDocument typeOfDocument;

    @Column(name = "path", nullable = false)
    private String path;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "send_date")
    private Date sendDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "read_date")
    private Date readDate;

    @Column(name = "create_by")
    private String createBy;

    @Enumerated(EnumType.STRING) // ВАЖЛИВО!
    @Column(name = "send_to")
    private Roles sendTo;

    public Document(String title, TypeOfDocument typeOfDocument, String path, boolean isRead,
                    Date sendDate, Date readDate, String createBy, Roles sendTo) {
        this.title = title;
        this.typeOfDocument = typeOfDocument;
        this.path = path;
        this.isRead = isRead;
        this.sendDate = sendDate;
        this.readDate = readDate;
        this.createBy = createBy;
        this.sendTo = sendTo;
    }
}
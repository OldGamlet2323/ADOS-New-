package dep22.mitit_duty_auto.dto;

import dep22.mitit_duty_auto.entities.enums.TypeOfDocument;
import dep22.mitit_duty_auto.entities.security.Roles;

import java.time.LocalDateTime; // Змінено на LocalDateTime
import java.util.Date;         // Цей імпорт можна прибрати, якщо readDate не використовується

public class DocumentDto {

    private Integer id;
    private String title;
    private String typeOfDocument; // String для відповідності з контролером
    private String path;
    private boolean isRead;
    private LocalDateTime sendDate;   // LocalDateTime
    // private Date readDate; // Закоментовано або видалено
    private String createBy;
    private String sendTo;         // String для відповідності з контролером

    public DocumentDto() {
    }

    public DocumentDto(Integer id, String title, String typeOfDocument, String path, String createBy, String sendTo, LocalDateTime sendDate, boolean isRead) {
        this.id = id;
        this.title = title;
        this.typeOfDocument = typeOfDocument;
        this.path = path;
        this.createBy = createBy;
        this.sendTo = sendTo;
        this.sendDate = sendDate;
        this.isRead = isRead;
    }

    // Геттери та Сеттери для String та LocalDateTime
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getTypeOfDocument() { return typeOfDocument; }
    public void setTypeOfDocument(String typeOfDocument) { this.typeOfDocument = typeOfDocument; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
    public LocalDateTime getSendDate() { return sendDate; }
    public void setSendDate(LocalDateTime sendDate) { this.sendDate = sendDate; }
    public String getCreateBy() { return createBy; }
    public void setCreateBy(String createBy) { this.createBy = createBy; }
    public String getSendTo() { return sendTo; }
    public void setSendTo(String sendTo) { this.sendTo = sendTo; }
}
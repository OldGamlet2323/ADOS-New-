package dep22.mitit_duty_auto.dto;

import lombok.Data;
import java.util.List;

@Data
public class PersonnelDataRequest {
    private String date; // "2025-01-15"
    private List<UnitData> units;

    @Data
    public static class UnitData {
        private Integer unitId;
        private String unitName;
        private Integer officersPermanent;
        private Integer officersVariable;
        private Integer cadets;
        private Integer contractPersonnel;
        private Integer militaryWorkers;
        private Integer total;
        private String personnelList;
    }
}
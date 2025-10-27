package dep22.mitit_duty_auto.entities.security;

import lombok.Getter;


@Getter
public enum Roles {
    DUTY_OFFICER_OF_MILITARY_UNIT("Черговий інституту"),
    CHIEF_OF_TROOPS_SERVICE("Комендант"),
    CHIEF_OF_STAFF("Начальник штабу");

    private final String name;

    Roles(String name) {
        this.name = name;
    }

}
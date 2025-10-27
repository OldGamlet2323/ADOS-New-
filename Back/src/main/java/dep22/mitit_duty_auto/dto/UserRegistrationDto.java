package dep22.mitit_duty_auto.dto;

import dep22.mitit_duty_auto.entities.security.Roles;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegistrationDto {
    private String name;
    private String password;
    private Roles role;
}

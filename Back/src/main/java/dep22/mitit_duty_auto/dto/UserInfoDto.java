package dep22.mitit_duty_auto.dto;

import dep22.mitit_duty_auto.entities.security.Roles;
import dep22.mitit_duty_auto.entities.security.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserInfoDto {
    private String name;
    private Roles role;

    public UserInfoDto(User user) {
        this.name = user.getName();
        this.role = user.getRole();
    }
}

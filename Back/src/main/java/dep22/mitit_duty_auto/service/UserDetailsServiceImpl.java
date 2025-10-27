package dep22.mitit_duty_auto.service;

import dep22.mitit_duty_auto.entities.security.Roles;
import dep22.mitit_duty_auto.entities.security.User;
import dep22.mitit_duty_auto.repos.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("==DEBUG== UserDetailsServiceImpl: Загрузка пользователя: " + username);

        User user = userRepository.findByName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));


        System.out.println("==DEBUG== UserDetailsServiceImpl: Пользователь найден: " + user.getName());
        System.out.println("==DEBUG== UserDetailsServiceImpl: Роли пользователя: " + user.getRole());

        Collection<? extends GrantedAuthority> authorities = mapRolesToAuthorities(user.getRole());

        System.out.println("LOG===User {" + username  + "} has authorities: {"+ authorities +"}" );

        return new org.springframework.security.core.userdetails.User(
                user.getName(),
                user.getPassword(),
                mapRolesToAuthorities(user.getRole())
        );
    }

    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Roles role) {
        System.out.println("==Log--mapRolesToAuthorities== " + role); // Выводим роль
        if (role == null) {
            throw new IllegalStateException("User must have a role.");
        }
        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role.name()));
        for (SimpleGrantedAuthority authority : authorities) {
            System.out.println("Authority: " + authority.getAuthority());
        }
        return authorities;
    }
}
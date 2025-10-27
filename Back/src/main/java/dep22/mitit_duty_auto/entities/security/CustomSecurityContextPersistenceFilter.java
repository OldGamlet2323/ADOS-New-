//package dep22.mitit_duty_auto.entities.security;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import jakarta.servlet.http.HttpSession;
//import org.springframework.security.core.context.SecurityContext;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.web.context.HttpRequestResponseHolder;
//import org.springframework.security.web.context.RequestAttributeSecurityContextRepository;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//
//public class CustomSecurityContextPersistenceFilter extends OncePerRequestFilter {
//
//    private final RequestAttributeSecurityContextRepository securityContextRepository;
//
//    public CustomSecurityContextPersistenceFilter(RequestAttributeSecurityContextRepository securityContextRepository) {
//        this.securityContextRepository = securityContextRepository;
//    }
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//        System.out.println("==DEBUG== CustomSecurityContextPersistenceFilter: Запрос: " + request.getRequestURI());
//
//        HttpSession session = request.getSession(false); // Получаем сессию (не создавать, если отсутствует)
//        if (session != null) {
//            System.out.println("==DEBUG== CustomSecurityContextPersistenceFilter: ID сессии при запросе к /api/reports: " + session.getId());
//        } else {
//            System.out.println("==DEBUG== CustomSecurityContextPersistenceFilter: Сессия отсутствует при запросе к /api/reports");
//        }
//
//
//        HttpRequestResponseHolder holder = new HttpRequestResponseHolder(request, response);
//
//        try {
//            SecurityContext contextBeforeChain = SecurityContextHolder.getContext();
//            System.out.println("==DEBUG== CustomSecurityContextPersistenceFilter: Контекст перед цепочкой: " + (contextBeforeChain.getAuthentication() != null ? contextBeforeChain.getAuthentication() : "null"));
//
//            filterChain.doFilter(request, response);
//
//            SecurityContext contextAfterChain = SecurityContextHolder.getContext();
//            System.out.println("==DEBUG== CustomSecurityContextPersistenceFilter: Контекст после цепочки: " + (contextAfterChain.getAuthentication() != null ? contextAfterChain.getAuthentication() : "null"));
//
//        } finally {
//            SecurityContext context = this.securityContextRepository.loadContext(holder);
//            SecurityContextHolder.setContext(context);
//            System.out.println("==DEBUG== CustomSecurityContextPersistenceFilter: Восстановленный контекст: " + (SecurityContextHolder.getContext().getAuthentication() != null ? SecurityContextHolder.getContext().getAuthentication() : "null"));
//        }
//    }
//}
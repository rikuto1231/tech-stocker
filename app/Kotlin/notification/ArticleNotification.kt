package notification

import java.time.LocalDateTime

data class ArticleNotification(
    val title: String,
    val url: String,
    val createdAt: LocalDateTime = LocalDateTime.now()
)

class ArticleNotificationService {
    fun createArticleNotification(title: String, url: String): ArticleNotification {
        validateArticleNotification(title, url)
        
        return ArticleNotification(
            title = title,
            url = url
        )
    }
    
    private fun validateArticleNotification(title: String, url: String) {
        if (title.isBlank()) {
            throw IllegalArgumentException("タイトルは必須です")
        }
        if (url.isBlank()) {
            throw IllegalArgumentException("URLは必須です")
        }
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            throw IllegalArgumentException("URLはhttp://またはhttps://で始まる必要があります")
        }
    }
} 
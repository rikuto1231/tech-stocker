package notification

fun main(args: Array<String>) {
    if (args.size != 2) {
        println("Usage: java -jar notification.jar <title> <url>")
        return
    }

    val service = ArticleNotificationService()
    try {
        val notification = service.createArticleNotification(args[0], args[1])
        println("""
            {
                "title": "${notification.title}",
                "url": "${notification.url}",
                "created_at": "${notification.createdAt}"
            }
        """.trimIndent())
    } catch (e: IllegalArgumentException) {
        println("""
            {
                "error": "${e.message}"
            }
        """.trimIndent())
    }
} 
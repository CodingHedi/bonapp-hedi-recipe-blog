import Giscus from "@giscus/react";
import { useTheme } from "@/context/ThemeContext";

const CATEGORY_ID = "DIC_kwDONthktc4CmNsr";
const REPO_ID = "R_kgDONthktQ=";
const CATEGORY = "Announcements";
const TERM = "Welcome to @giscus/react component!";

export default function Comments() {
  const { isDarkMode } = useTheme();

  return (
    <Giscus
      id="comments"
      repo="CodingHedi/bonapphedi-comments"
      repoId={REPO_ID}
      category={CATEGORY}
      categoryId={CATEGORY_ID}
      mapping="url"
      strict="1"
      term={TERM}
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={isDarkMode ? "dark" : "light"}
      lang="fr"
      loading="lazy"
    />
  );
}

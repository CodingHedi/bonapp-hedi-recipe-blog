import { useState } from "react";
import { useRef } from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Select, { MultiValue, SelectInstance } from "react-select";
import fuzzy from "fuzzy";
import { useTheme } from "@/context/ThemeContext";
import HeroCarousel from "@/components/HeroCarousel";
import Card from "@/components/Card";
import { Post } from "@/pages/Post";

type HomeProps = {
  posts: Post[];
};

type Option = {
  value: string;
  label: string;
};

export default function Home({ posts }: HomeProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
  const [authorFilter, setAuthorFilter] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const tagSelectRef = useRef<SelectInstance<Option, true>>(null);
  const { isDarkMode } = useTheme();

  const styles = {
    container: {
      backgroundColor: isDarkMode ? "#121212" : "#f9f9f9",
      color: isDarkMode ? "#ffffff" : "#000000",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      paddingTop: "40px",
    },
    divline: {
      width: "100%",
      height: "1px",
      backgroundColor: isDarkMode ? "#333" : "#ccc",
      margin: "20px 0",
    },
    wrapper: {
      width: "60%",
    },
    inputs: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
    },
    filtersContainer: {
      width: "70%",
    },
    themeToggle: {
      marginBottom: "10px",
      padding: "10px 15px",
      marginRight: "10px",
      border: "none",
      borderRadius: "5px",
      backgroundColor: isDarkMode ? "#f9f9f9" : "#121212",
      color: isDarkMode ? "#121212" : "#ffffff",
      cursor: "pointer",
    },
    searchInput: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "5px",
      border: "1px solid",
      borderColor: isDarkMode ? "#555" : "#eee",
      backgroundColor: isDarkMode ? "#333" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
    },
    filters: {
      width: "100%",
      marginBottom: "15px",
      display: "flex",
      gap: "10px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "20px",
    },
    card: {
      border: "1px solid",
      borderColor: isDarkMode ? "#555" : "#eee",
      borderRadius: "10px",
      backgroundColor: isDarkMode ? "#333" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
      transition: "background-color 0.3s, color 0.3s",
    },
    cardText: {
      padding: "5px",
    },
    cardHeader: {},
    cardBody: {},
    cardFooter: {},
    cardAvatar: {
      borderRadius: "50%",
    },
    cardTitle: {
      fontSize: "24px",
      padding: "5px",
    },
    cardDesc: {
      fontSize: "14px",
    },
    cardImage: {
      width: "100%",
      height: "200px",
      borderTopLeftRadius: "10px",
      borderTopRightRadius: "10px",
      objectFit: "cover",
      marginBottom: "10px",
    },
    cardTags: {
      direction: "rtl",
      marginTop: "10px",
      marginLeft: "5px",
      marginRight: "5px",
      marginBottom: "10px",
      display: "flex",
      flexWrap: "wrap",
      gap: "5px",
    },
    tag: {
      border: "1px solid",
      borderColor: isDarkMode ? "#333" : "#ddd",
      backgroundColor: isDarkMode ? "#555" : "#f0f0f0",
      color: isDarkMode ? "#fff" : "#333",
      borderRadius: "10px",
      fontSize: "12px",
      cursor: "pointer",
      transition: "background-color 0.3s, color 0.3s",
    },
    selectedTag: {
      border: "1px solid",
      borderColor: isDarkMode ? "#555" : "#eee",
      backgroundColor: isDarkMode ? "#777" : "#ddd",
      color: isDarkMode ? "#fff" : "#000",
    },
  };

  const getFeaturedRecipes = (
    posts: Post[],
    mode: "bySlug" | "random" | "last" = "last", // Default mode is "last"
    options: { slugs?: string[] } = {}
  ): Post[] => {
    switch (mode) {
      case "bySlug": {
        const { slugs = [] } = options; // Default to an empty array if no slugs provided
        return posts.filter((post) => slugs.includes(post.slug)).slice(0, 4);
      }
      case "random": {
        const shuffled = [...posts].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 4);
      }
      case "last": {
        return posts.sort((a, b) => new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime()).slice(0, 4);
      }
      default:
        return posts.sort((a, b) => new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime()).slice(0, 4); // Default fallback to "last"
    }
  };

  const featuredRecipes = getFeaturedRecipes(posts);

  const authorOptions: Option[] = [
    { value: "", label: "Auteurs" },
    ...[...new Set(posts.map((post) => post.frontMatter.author))].map((author) => ({
      value: author,
      label: author,
    })),
  ];

  const sortOptions: Option[] = [
    { value: "", label: "Trier par date" },
    { value: "newest", label: "Plus récent" },
    { value: "oldest", label: "Plus ancien" },
  ];

  const tagOptions: Option[] = Array.from(new Set(posts.flatMap((post) => post.frontMatter.tags || []))).map((tag) => ({
    value: tag,
    label: tag,
  }));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterPosts({ search: term });
  };

  const handleSortChange = (selectedOption: Option | null) => {
    const value = selectedOption?.value || "";
    setSortOption(value);
    filterPosts({ sort: value });
  };

  const handleAuthorFilterChange = (selectedOption: Option | null) => {
    const value = selectedOption?.value || "";
    setAuthorFilter(value);
    filterPosts({ author: value });
  };

  const handleTagFilterChange = (newValue: MultiValue<Option>) => {
    const tags = newValue.map((option) => option.value);
    filterPosts({ tags });
  };
  const handleTagClick = (tag: string) => {
    tagSelectRef.current?.selectOption({ value: tag, label: tag });
  };

  const filterPosts = ({
    search = searchTerm,
    sort = sortOption,
    author = authorFilter,
    tags = tagSelectRef.current?.getValue().map((option) => option.value) || [],
  }: {
    search?: string;
    sort?: string;
    author?: string;
    tags?: string[];
  }) => {
    console.log("tag : ", ...tags);
    let updatedPosts = posts;

    if (search) {
      const titles = posts.map((post) => post.frontMatter.title);
      const fuzzyResults = fuzzy.filter(search, titles);
      updatedPosts = fuzzyResults.map((result) => posts[result.index]);
    }

    if (author) {
      updatedPosts = updatedPosts.filter((post) => post.frontMatter.author === author);
    }

    if (tags.length > 0) {
      updatedPosts = updatedPosts.filter((post) => tags.every((tag) => post.frontMatter.tags?.includes(tag)));
    }

    if (sort === "newest") {
      updatedPosts.sort((a, b) => new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime());
    } else if (sort === "oldest") {
      updatedPosts.sort((a, b) => new Date(a.frontMatter.date).getTime() - new Date(b.frontMatter.date).getTime());
    }

    setFilteredPosts(updatedPosts);
  };

  return (
    <div>
      {/* Hero Section */}
      <HeroCarousel recipes={featuredRecipes} />
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <div style={styles.divline}></div>
          <div style={styles.inputs}>
            <div style={styles.filtersContainer}>
              {/* Search bar */}
              <input
                type="text"
                placeholder="Taper ici pour rechercher"
                value={searchTerm}
                onChange={handleSearchChange}
                style={styles.searchInput}
              />

              <div style={styles.filters}>
                {/* Author filter */}
                <Select
                  options={authorOptions}
                  onChange={handleAuthorFilterChange}
                  styles={{
                    container: (base) => ({ ...base, flex: 1 }),
                    control: (base) => ({
                      ...base,
                      backgroundColor: isDarkMode ? "#333" : "#fff",
                      color: isDarkMode ? "#fff" : "#000",
                      borderColor: isDarkMode ? "#555" : "#ccc",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: isDarkMode ? "#333" : "#fff",
                      color: isDarkMode ? "#fff" : "#000",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? (isDarkMode ? "#555" : "#eee") : isDarkMode ? "#333" : "#fff",
                      color: state.isSelected ? (isDarkMode ? "#fff" : "#000") : base.color,
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: isDarkMode ? "#555" : "#eee",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: isDarkMode ? "#fff" : "#000",
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: isDarkMode ? "#fff" : "#000",
                      ":hover": {
                        backgroundColor: isDarkMode ? "#777" : "#ddd",
                        color: isDarkMode ? "#fff" : "#000",
                      },
                    }),
                  }}
                  placeholder="Trier par Auteur"
                />
                {/* Tag filter */}
                <Select
                  ref={tagSelectRef}
                  options={tagOptions}
                  isMulti
                  onChange={handleTagFilterChange}
                  styles={{
                    container: (base) => ({ ...base, flex: 1 }),
                    control: (base) => ({
                      ...base,
                      backgroundColor: isDarkMode ? "#333" : "#fff",
                      color: isDarkMode ? "#fff" : "#000",
                      borderColor: isDarkMode ? "#555" : "#ccc",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: isDarkMode ? "#333" : "#fff",
                      color: isDarkMode ? "#fff" : "#000",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? (isDarkMode ? "#555" : "#eee") : isDarkMode ? "#333" : "#fff",
                      color: state.isSelected ? (isDarkMode ? "#fff" : "#000") : base.color,
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: isDarkMode ? "#555" : "#eee",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: isDarkMode ? "#fff" : "#000",
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: isDarkMode ? "#fff" : "#000",
                      ":hover": {
                        backgroundColor: isDarkMode ? "#777" : "#ddd",
                        color: isDarkMode ? "#fff" : "#000",
                      },
                    }),
                  }}
                  placeholder="Trier par Tags"
                />
                {/* Date filter */}
                <Select
                  options={sortOptions}
                  onChange={handleSortChange}
                  styles={{
                    container: (base) => ({ ...base, flex: 1 }),
                    control: (base) => ({
                      ...base,
                      backgroundColor: isDarkMode ? "#333" : "#fff",
                      color: isDarkMode ? "#fff" : "#000",
                      borderColor: isDarkMode ? "#555" : "#ccc",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: isDarkMode ? "#333" : "#fff",
                      color: isDarkMode ? "#fff" : "#000",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? (isDarkMode ? "#555" : "#eee") : isDarkMode ? "#333" : "#fff",
                      color: state.isSelected ? (isDarkMode ? "#fff" : "#000") : base.color,
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: isDarkMode ? "#555" : "#eee",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: isDarkMode ? "#fff" : "#000",
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: isDarkMode ? "#fff" : "#000",
                      ":hover": {
                        backgroundColor: isDarkMode ? "#777" : "#ddd",
                        color: isDarkMode ? "#fff" : "#000",
                      },
                    }),
                  }}
                  placeholder="Trier par Date"
                />
              </div>
            </div>
          </div>
          <br />
          {/* Blog post grid */}
          <div style={styles.grid}>
            {filteredPosts.map((post) => (
              <div key={post.slug} style={styles.card}>
                <Card key={post.slug} post={post} handleTagClick={handleTagClick} />
              </div>
            ))}
          </div>
          <div style={styles.divline}></div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), "content");
  const filenames = fs.readdirSync(postsDirectory);

  const requiredFields = ["title", "date", "author", "ingredients", "steps"];

  const posts: Post[] = filenames
    .filter((filename) => filename !== "rating.md") // Exclude "rating.md"
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      // Validate the required fields exist in the file
      const hasAllRequiredFields =
        requiredFields.every((field) => field in data) && 
        Array.isArray(data.ingredients) && 
        Array.isArray(data.steps);

      // If the structure is invalid, return null
      if (!hasAllRequiredFields) {
        console.warn(`Ignoring file ${filename}: missing required fields.`);
        return null;
      }

      return {
        slug: filename.replace(".md", ""),
        frontMatter: data as Post["frontMatter"],
      };
    })
    .filter((post): post is Post => post !== null); // Remove null entries from the array

  return {
    props: {
      posts,
    },
  };
}

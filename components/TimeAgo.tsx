import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const YEAR = "year";
const MONTH = "month";
const DAY = "day";
const HOUR = "hour";
const MINUTE = "minute";
const SECOND = "second";

function formatTimeAgo(date: string | number | Date) {
  const now = new Date();
  const postDate = new Date(date);

  // Check if the date is valid
  if (isNaN(postDate.getTime())) {
    return "Invalid date";
  }

  const diffInMs = now.getTime() - postDate.getTime();

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (years > 0) return formatter.format(-years, YEAR);
  if (months > 0) return formatter.format(-months, MONTH);
  if (days > 0) return formatter.format(-days, DAY);
  if (hours > 0) return formatter.format(-hours, HOUR);
  if (minutes > 0) return formatter.format(-minutes, MINUTE);

  return formatter.format(-seconds, SECOND);
}

interface TimeAgoProps {
  date: string | number | Date;
}

export default function TimeAgo({ date }: TimeAgoProps) {
  const [formattedTime, setFormattedTime] = useState("Loading...");
  const isDarkMode = useTheme();

  useEffect(() => {
    if (!date) {
      setFormattedTime("Invalid date");
      return;
    }

    setFormattedTime(formatTimeAgo(date));
  }, [date]);

  const styles = {
    date: {
      paddingLeft: "5px",
      color: isDarkMode ? "#696969" : "#dedcdc",
      fontStyle: "italic",
      fontSize: "12px",
      cursor: "help",
    },
  };

  return (
    <span style={styles.date} title={new Date(date).toLocaleDateString()}>
      {formattedTime}
    </span>
  );
}

import { useContext, useEffect, useState } from "react";
import { FeedbackItemsContext } from "../contexts/FeedbackItemsContextProvider";
import { TfeedbackItem } from "./types";

export const useFeedbackItemsContext = () => {
  const context = useContext(FeedbackItemsContext);
  if (!context) {
    throw new Error(
      "useFeedbackItems must be used within a FeedbackItemsContextProvider"
    );
  }
  return context;
};

export function useFeedbackItems() {
  const [feedbackItems, setFeedbackItems] = useState<TfeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFeedbackItems = async () => {
      setIsLoading(true);
      try {
        const resp = await fetch(
          "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
        );
        if (!resp.ok) throw new Error();
        const data = await resp.json();
        setFeedbackItems(data.feedbacks);
      } catch (error) {
        setErrorMessage("Sorry, something went wrong.");
      }
      setIsLoading(false);
    };
    fetchFeedbackItems();
  }, []);
  return {
    feedbackItems,
    isLoading,
    errorMessage,
    setFeedbackItems,
  };
}

import { create } from "zustand";
import { TfeedbackItem } from "../lib/types";

type Store ={
    feedbackItems: TfeedbackItem[];
    isLoading: boolean;
    errorMessage: string;
    selectedCompany: string;
    getCompanyList:() => string[];
    getFilteredFeedbackItems:() => TfeedbackItem[];
    addItemToList:(text:string) => Promise<void>;
    selectCompany:(company:string) => void;
    fetchFeedbackItems:() => Promise<void>;
}

export const useFeedbackItemsStore = create<Store>((set, get) => ({
  feedbackItems: [],
  isLoading: false,
  errorMessage: "",
  selectedCompany: "",
  getCompanyList: () => {
    return get()
      .feedbackItems.map((item) => item.company)
      .filter((company, index, array) => {
        return array.indexOf(company) === index;
      });
  },
  getFilteredFeedbackItems : () =>{
    const state = get();

      return state.selectedCompany
        ? state.feedbackItems.filter(
            (feedbackItem) => feedbackItem.company === state.selectedCompany
          )
        : state.feedbackItems
  },
  addItemToList: async (text: string) => {
    const companyName = text
      .split(" ")
      .find((word) => word.includes("#"))!
      .substring(1);
    // convert first letter of company to uppercase:
    const upperCase =
      companyName.charAt(0).toUpperCase() + companyName.slice(1);

    const newItem: TfeedbackItem = {
      id: new Date().getTime(),
      text: text,
      upvoteCount: 0,
      daysAgo: 0,
      company: upperCase,
      badgeLetter: companyName.substring(0, 1).toUpperCase(),
    };

    // setFeedbackItems([...feedbackItems, newItem]);
    set((state) => ({
      feedbackItems: [...state.feedbackItems, newItem],
    }));

    await fetch(
      "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks",
      {
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      }
    );
  },
  selectCompany: (company: string) => {
    // setSelectedCompany(company)
    set(() => ({
      selectedCompany: company,
    }));
  },
  fetchFeedbackItems: async () => {
    //   setIsLoading(true);
    set(() => ({
      isLoading: true,
    }));
    try {
      const resp = await fetch(
        "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
      );
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      // setFeedbackItems(data.feedbacks);
      set(() => ({
        feedbackItems: data.feedbacks,
      }));
    } catch (error) {
      // setErrorMessage("Sorry, something went wrong.")
      set(() => ({
        errorMessage: "Sorry, something went wrong.",
      }));
    }
    //   setIsLoading(false);
    set(() => ({
      isLoading: false,
    }));
  },
}));

import React from "react";
import { getDict, WordDictObs } from "../../store/Content";
import { DictionaryItem } from "../../types";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export interface DictListProps {
  selection: (e: string) => void;
}

const DictList = ({selection}: DictListProps): React.ReactElement => {
  const [words, getWords] = React.useState<DictionaryItem[] | null>(null);
  const nav = useNavigate();
  const getDictWords = async () => {
    const isSuccessful = await getDict();
    if(isSuccessful === 403) {
      toast.error('You have been logged out.')
      nav('/entrance/login');
    }
  };

  React.useEffect(() => {
    getDictWords();
    const sub = WordDictObs.asObservable().subscribe((words) => {
      getWords(words);
    });
    return () => sub.unsubscribe();
  }, []);

  return words && words?.length > 0 ? (
    <div
      className="box"
      style={{
        maxHeight: 130,
        overflow: "hidden",
        overflowY: "scroll",
      }}
    >
      <ul>
       {words.map(word => 
         <li key={word._id}>
         <button className="is-ghost" onClick={() => selection(word.text)}>{word.text}</button>
       </li>
       )}
      </ul>
    </div>
  ) : (
    <>
      <p className="text">You're all caught up...</p>
    </>
  );
};

export default DictList;

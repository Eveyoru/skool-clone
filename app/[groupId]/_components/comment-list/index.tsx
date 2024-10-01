// import { Doc} from "@/convex/_generated/dataModel";
// // import {  Id } from "@/convex/_generated/dataModel"; strict comment
// import { CommentCard } from "./comment-card";
// // import { Input } from "@/components/ui/input"; strict comment
// import { CommentInput } from "./comment-input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useEffect, useRef } from "react";
// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useMemo } from 'react';

// interface CommentListProps {
//     post: Doc<"posts"> & {
//         likes: Doc<"likes">[];
//         comments: Doc<"comments">[];
//         author: Doc<"users">;
//     };
// }

// export const CommentList = ({ post }: CommentListProps) => {
//     const scrollRef = useRef<HTMLDivElement>(null);
//     // const comments = useQuery(api.comments.list, { postId: post._id }) || [];strict comment
// const { data: rawComments } = useQuery(api.comments.list, { postId: post._id });
// const comments = useMemo(() => rawComments || [], [rawComments]);
//     useEffect(() => {
//         scrollToBottom();
//     }, [comments])

//     const scrollToBottom = () => {
//         if (scrollRef.current) {
//             scrollRef.current.scrollIntoView({ behavior: "smooth" });
//         }
//     };
//     return (
//         <div className="flex flex-col gap-y-8">
//             <CommentInput postId={post._id} />
//             <ScrollArea className="max-h-[250px] border px-2">
//                 <div className="flex flex-col space-y-8">
//                     {comments.map((comment) => (
//                         <CommentCard key={comment._id} comment={comment} author={post.author} />
//                     ))}
//                     <div ref={scrollRef} />
//                 </div>
//             </ScrollArea>
//         </div>
//     );
// };




import { Doc } from "@/convex/_generated/dataModel";
import { CommentCard } from "./comment-card";
import { CommentInput } from "./comment-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Define the type for the comments you expect
interface Comment {
    author: {
        _id: string;
        _creationTime: number;
        about?: string;
        profileUrl?: string;
        tokenIdentifier: string;
        name: string;
        email: string;
    };
    _id: string;
    _creationTime: number;
    content: string;
    authorId: string;
    postId: string;
}

interface CommentListProps {
    post: Doc<"posts"> & {
        likes: Doc<"likes">[];
        comments: Doc<"comments">[];
        author: Doc<"users">;
    };
}

export const CommentList = ({ post }: CommentListProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // Use type assertion for rawComments
    const { data: rawComments } = useQuery<Comment[]>(api.comments.list, { postId: post._id }) || { data: [] };
    
    // UseMemo to handle raw comments
    const comments = useMemo(() => rawComments || [], [rawComments]);

    useEffect(() => {
        scrollToBottom();
    }, [comments]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="flex flex-col gap-y-8">
            <CommentInput postId={post._id} />
            <ScrollArea className="max-h-[250px] border px-2">
                <div className="flex flex-col space-y-8">
                    {comments.map((comment) => (
                        <CommentCard key={comment._id} comment={comment} author={post.author} />
                    ))}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>
        </div>
    );
};





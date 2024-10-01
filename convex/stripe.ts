import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action, internalAction } from "./_generated/server";
import Stripe from 'stripe';
import { Id } from "./_generated/dataModel";
// import { updateSubscriptionById } from "./groups";


export const pay = action({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        const clerkUser = await ctx.auth.getUserIdentity();
        const user = await ctx.runQuery(api.users.currentUser, {});

        if (!user || !clerkUser) {
            throw new Error("User not authenticated!");
        }

        if (!clerkUser.emailVerified) {
            throw new Error("User email not verified!");
        }

        const groupId = await ctx.runMutation(api.groups.create, { name: args.name });

        if (!groupId) {
            throw new Error("Group not created!");
        }

        const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!, {
            apiVersion: "2024-06-20"
        });

        const domain = process.env.NEXT_PUBLIC_HOSTING_URL!;
        // const session: Stripe.Response<Stripe.Checkout.Session> = await stripe.checkout.sessions.create(
        const session: any = await stripe.checkout.sessions.create(
            {
                mode: "subscription",
                line_items: [
                    {
                        price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID!,
                        quantity: 1,
                    },
                ],
                customer_email: clerkUser.email,
                metadata: {
                    groupId: groupId,
                },
                success_url: `${domain}/${groupId}`,
                cancel_url: `${domain}`,
            }
        );
        return session.url;
    },
});

type Metadata = {
    groupId: Id<"groups">;
}

// export const fulfill = internalAction({
//     args :{ signature : v.string(), payload: v.string()},

//     handler: async ({ runQuery, runMutation},{signature, payload})=>{
//         const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!, {
//             apiVersion : "2024-06-20",
//             });


//             const WebhookSecret = process.env.STRIPE_WEHOOK_SECRET as string;

//             try {
                
//                     const event = await Stripe.webhooks.constructEventAsync{
//                         payload,
//                         signature,
//                         WebhookSecret
//                     };

//                     const completedEvent = event.data.object as Stripe.Checkout.Session &{
//                                         metadata: Metadata;
//                                     }
//                 if(event.type === "checkout.session.completed"){
//                     const subscription = await stripe.subscriptions.retrieve(
//                       completedEvent.subscription as string)
//                                                     }
//               const groupId = completedEvent.metadata.groupId;

//               await runMutation(internal.groups.updateSubscription,{
//                                 groupId,
//                                 subscriptionId: subscription.id,
//                endsOn: subscription.current_period_end * 1000,
//                             });
//                         }

//                 if(event.type === "invoive,payment_succeeded") {
//                     const subscription = await stripe.subscriptions.retrieve(completedEvent.subscription as string);
                
//                     await runMutation(internal.groups.updateSubscriptionById,{
//                         subscriptionId: subscription.id,
//                         endsOn: subscription.current_period_end * 1000,
//                     });
//                 }
//                 return{success:true};
//              } catch (error) {
//                 console.log(error);
//     return{success:false, error:(error as {message: string}).message};
//             },
//         });
    
        

    
     

      
            
            



 
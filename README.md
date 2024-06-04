Infra...
- AWS seems to have best cold start time
- CDN options for Azure suck/expensive
- Can't do low traffic serverless cheaply at gcp with good cold start
Basically all these guys prefer large customers that keep stuff on all the time. AWS is better for small stuff in addition
- I get cloudfront + cert manage + good low traffic options at AWS
Open to learning other clouds when I have enough traffic that the providers are more similar in offerings
Small stuff AWS has advantage

Path forward
- New AWS account
- TF for Lambda, s3, cloudfront
- Pipeline to build docker image, deploy to S3


React Flow concept maps!!!!
- Tell me more button
- to flash card button
- Chat screen to concept map link?


# TODO   
3. Flashcards
  1. Flashcard screen has search view based on tags
  1. Endpoint to count what cards are ready for study
  1. Ability to enter study screen with a tag
  1. Study screen can POST to /flashcards/review, update db
  1. Clean up aesthetics of flashcard screen
Polish
- Notes need CRUD on notes screen
- Flash cards need CRUD on FC screen (import/export)?
- Notes/flashcards proper search?
- Mobile friendly...


# https://gist.github.com/lAnubisl/817dc46b63905340ad44fd9a85798fd2
# https://learn.microsoft.com/en-us/azure/storage/blobs/storage-custom-domain-name?tabs=azure-portal


Nice to have
1. Strong need to capture "THEME" or subject of each card. The cards themselves don't have a lot of context in definition alone
1. Vector db design?
1. Message pagination
1. Ability to generate flashcards from arbitrary topic would be sweet
  1. Magic buttons? The qhelper could go there too




Development Roadmap
1. e2e basic functionality, enough to show ppl
2. Auth, cloud deploy, pipelines, etc
3. Track token usage in a table

# Cloud architecture
1. Try out Azure
2. Supabase postgres
3. Azure function
4. Azure static web app
Need to evaluate a few different models and compare performance vs cost
5. https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard
6. Maybe track the tokens used by each user, model, cost per etc. DIY
7. Steal features from : https://portkey.ai/features/observability
8. gpt 3.5 turbo, 4 omni price compare and feature compare
https://learn.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-static-website-terraform?tabs=azure-cli
9. https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_function_app
10. linux or zip deploy
11. Lets start on github since we're gonna want it to be open source eventually
12. So github -> azure functiond deploy is what we're looking for
13. Auth.........SUPABASE




# How to add/integrate the endpoints for flashcards/notes?
- Option 1 is to generate the data then come back and present it to user, POSTING when they approve
- Option 2 is to Save data on generation as draft, then have them approve it if desired
    - This would leave junk in db though
- So clearly want to do option 1.
  - Step 1: Endpoint to generate flashcard, note...have that already?
  - Note process is immediate, already ahve it
  - Flash card has a draft state.
  - Get TAGS endpoint





## DB commands
Create migration 

`alembic revision --autogenerate -m "Initial migration"`  

Run it

`alembic upgrade head`


# Ideas
- Lose JSON structure and just have it make a paragraph per analysis, split as needed but no map reduce
- finagle with size of pages analyzed  

# Also
- Extract memorable experience?
- Psychologist advice?


https://pashpashpash.substack.com/p/tackling-the-challenge-of-document
https://pashpashpash.substack.com/p/understanding-long-documents-with

| --- | --- | --- |
| --- | --- | --- |
| Cell 1 | Cell 2 | Cell 3 |  
| Cell 4 | Cell 5 | Cell 6 |

providing context based on the drill down seems important

could do that via a cache...but langchain probably has a better way


----
Viewing data over time...

Would also want it to measure "how happy was person at this time"

Describe relationship status at this time: Relationship, single, fwb'ing

"Identify the most impactful or memorable part of this entry"
Priority
Struggle
Describe the overall mood of this entry...maybe grade on a scale of 1-10?


 Sentiment Analysis
"Analyze the overall sentiment of my journal entries for each year. What are the general trends in emotion, and how do they correlate with major life events noted in the journals?"
2. Theme and Topic Identification
"Identify the most common themes and topics discussed in my journals over the last few years. How have my interests and concerns evolved over time?"
3. Frequency of Specific Words or Phrases
"Track the frequency of specific words or phrases like 'happy', 'stress', 'achievement', and 'failure'. What does the usage pattern of these words tell about my emotional and psychological state during these periods?"
4. Goal Tracking and Progress
"Review mentions of goals or resolutions across my journals. Which goals have I mentioned starting, progressing, or achieving? How does this reflect on my persistence and dedication?"
5. Relationship Analysis
"Analyze entries related to relationships and social interactions. Which relationships have been the most influential in my life as reflected in the journals? How have my interactions with these individuals evolved?"
6. Problem-Solving and Challenges
"Identify and analyze how I've discussed dealing with challenges and difficulties. What strategies have I mentioned, and what can be inferred about my problem-solving skills?"
7. Reflections and Future Predictions
"Extract parts where I reflect on my past or predict my future. How accurate have my predictions been, and what does this say about my self-awareness and foresight?"
8. Changes in Life Philosophy
"Identify any shifts in my life philosophy or attitudes toward significant concepts like work, family, and self-worth. What triggered these changes, according to my journals?"
9. Mental Health Insights
"Analyze entries that discuss mental health, including stress, anxiety, and joy. Are there identifiable triggers or patterns that affect my mental health according to the journal?"
10. Creative and Professional Development
"Review how I discuss my professional and creative projects. What insights can be drawn about my growth and development in these areas?"
11. Self-Perception vs. Actions
"Compare my self-descriptions to the actions I’ve recorded. Do my reflections align with the actions I’ve taken, and what does this reveal about my self-perception?"
12. Most Memorable Entries
"Identify the top five most impactful or memorable entries over the last few years. Why might these stand out, and what do they collectively say about my personal journey?"
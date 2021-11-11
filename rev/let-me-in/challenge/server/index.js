import CryptoES from 'crypto-es';
import express from 'express';
import morgan from 'morgan';

const app = express();
app.use(morgan())
app.use(express.json());
const port = 1337;

const data =
`
Mr. Ping's MACS Bible

1 In the beginning Jordan created a save file and then clicked his fingers; creating the big bang and blowing the known universe into existence
2 Jordan saw all that he had created and it was good
3 He saw what was good and decided to depart it from that which was not
3.5 HACKMAC{r34c7_n471v3_r3vv1ng_c4n_b3_n1c3}
4 He then created time, dividing all that is from all that was
5 Jordan watched the universe take shape as the time he had created pushed it forward, causing the creation of the sciences
6 He then created MACS, the group for his followers
7 There was a single planet of which he took special notice; the planet of earth
8 There was nothing that occurred on this planet, no tides, no days, no life
9 Jordan then created the MACS executives to nourish and nurture the earth, allowing for life to survive on the planet he loved so much.
10 First he created Lin, the executive who created and controlled the sun. 
11 He then created Mitchell, the executive of the sea who created the tides. 
12 He then created Dai, the executive of weather who controlled the skys. 
13 Jordan played with the life forms on the planet, making them grow and wiping them out with the powers of the MACS execs.
14 After experimenting on the life forms of earth over millennia, Jordan decided to create a life form of which he could communicate with.
15 He created human life.
16 He watched the humans grow and evolve, creating their own buildings and societies.
17 One day, Jordan took human form and went to the earth to meet the humans.
18 The humans did not listen to his word and shunned him for they believed in their own deities.
19 This angered Jordan for he had been betrayed by the humans he had created.
20 Jordan then left the earth and created Jack, the bringer of death, and set him to work.
21 As time passed, Jordan watched as his beloved humans die as they did not acknowledge him as their creator.
22 Out of the despair that was created by Jack, Jordan heard voices. Prayers asking him for forgiveness.
23 Jordan listened to the prayers and knew he wanted to forgive them.
24 He decided to place protection over those who accepted and thanked him as their creator so that Jack could not touch them.
25 Jordan decided he had enough of watching his beloved humans die and created a MACS exec in his own image. He created Alex, the exec of misplacing items.
26 Jordan sent Alex to earth to spread word about him, to tell them that they will all be forgiven if they simply ask for forgiveness.
27 More and more humans began to ask Jordan for forgiveness who then happily placed protection over them
28 After some time of Alex being on the earth, Jordan created the church of MACS for his followers where they could come together and pay tribute to both him and the execs
29 As the church began to fill, Jordan decided to promote his most loyal followers, creating the booster clan.
30 This clan was the most prestigious group in the universe, a group where all members of the MACS church would be aware of your existence
`.split('\n');
const password = 'password';

app.get('/flag/:i', (req, res) => {
  const i = req.params.i;
  const plaintext = data[i % data.length];

  const ciphertext = CryptoES.AES.encrypt(plaintext, password).toString();

  res.send({ message: ciphertext });
});

app.post('/checkPass', (req, res) => {
  const pass = req.body.password;

  if (pass === password) {
    res.status(200).send();
  } else {
    res.status(403).send();
  }
});

app.get('/', (req, res) => {
  return res.status(200).send();
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

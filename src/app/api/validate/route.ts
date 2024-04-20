// Function to check if the sequence of moves is a valid solution for Tower of Hanoi
const isValidHanoiMoveSequence = (numDiscs: number, moves: any) => {
    const pegs = { A: [], B: [], C: [] };
    // Initialize peg A with discs in size order
    for (let i = numDiscs; i > 0; i--) {
        pegs.A.push(i);
    }

    for (const move of moves) {
        const { from, to } = move;
        if (!pegs[from].length || (pegs[to].length && pegs[to].slice(-1)[0] < pegs[from].slice(-1)[0])) {
            return false;
        }
        pegs[to].push(pegs[from].pop());
    }

    return pegs['C'].length === numDiscs;
};

export async function POST(req: Request) {
    const { moves } = await req.json();
    const isValid = isValidHanoiMoveSequence(parseInt(process.env.NUM_DISCS || '5'), moves);
    // const message = isValid ? 'Valid sequence of moves!' : 'Invalid move sequence. Please try again.';
    if (isValid) {
        return Response.json({
                message: "Seqeuenza di tappe corretta.",
                location: process.env.LOCATION},
            {status: 200}
        )
    } else {
        return Response.json({message: "La sequenza di tappe non è corretta. Prova di nuovo"},  {status: 400} )
    }
}

export function GET(req: Request) {
    return Response.json({message: "Method Not Allowed"},  {status: 405} )
}

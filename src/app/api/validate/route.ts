interface Move {
    from: string;
    to: string;
}

// Function to check if the sequence of moves is a valid solution for Tower of Hanoi
const isValidHanoiMoveSequence = (numDiscs: number, moves: Move[]) => {
    const pegs: { [key: string]: number[] } = { A: [], B: [], C: [] }; // Better to explicitly define the type

    // Initialize peg A with discs in size order
    for (let i = numDiscs; i > 0; i--) {
        pegs.A.push(i);
    }

    try {
        for (const move of moves) {
            const { from, to } = move;
            // Ensure move is valid by checking if pegs[from] and pegs[to] are defined and handling operations safely
            if (!pegs[from].length || (pegs[to].length && pegs[to].slice(-1)[0] < pegs[from].slice(-1)[0])) {
                return false; // Invalid move found
            }
            pegs[to].push(pegs[from].pop()!); // Use '!' to assert that pop() will not return undefined
        }
    } catch (error) {
        return false
    }

    // Check if all discs are on peg C
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

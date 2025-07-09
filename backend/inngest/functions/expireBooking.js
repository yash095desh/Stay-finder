const Booking = require("../../modals/bookings");
const { inngest } = require("../client");


const expireBooking = inngest.createFunction(
    {id: 'expire-booking-after-2hr'},
    {event: 'booking/reserved'},
    async({event, step}) =>{
        const { bookingId } = event?.data;

        await step.sleep("wait-2-hours","2h");

        const booking = await Booking.findById(bookingId);

        if(booking.status === "pending"){
            booking.status = "cancelled"
            await booking.save();
        }

        return { status: booking?.status || "not found" };
    }
)

module.exports = { expireBooking };